// src/pages/SettingsPage.jsx
import React, { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  fetchMySettings,
  updateMySettings,
  fetchGlobalSettings,
  updateGlobalSettings
} from '../services/settingsApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const profileSchema = Yup.object().shape({
  fullName: Yup.string().required('Name required'),
  email: Yup.string().email('Invalid email').required('Email required'),
});

const systemSchema = Yup.object().shape({
  timezone: Yup.string().required('Timezone required'),
  language: Yup.string().required('Language required'),
  defaultWeightCategory: Yup.string().required('Select weight category'),
});

const notificationsSchema = Yup.object().shape({
  emailNotifications: Yup.boolean(),
  smsNotifications: Yup.boolean(),
});

const adminSchema = Yup.object().shape({
  allowedStatuses: Yup.string().nullable(), // JSON string
});

const SettingsPage = () => {
  const [mySettings, setMySettings] = useState(null);
  const [globalSettings, setGlobalSettings] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // set based on JWT or API

  useEffect(() => {
    loadSettings();
    // detect role from token if possible
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const roles = payload.role || payload.roles || payload.authorities;
        if (roles && (roles.includes('ADMIN') || roles.includes('ROLE_ADMIN'))) {
          setIsAdmin(true);
          loadGlobalSettings();
        }
      } catch (e) {}
    }
  }, []);

  async function loadSettings() {
    try {
      const data = await fetchMySettings();
      setMySettings(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load your settings');
      setMySettings({});
    }
  }

  async function loadGlobalSettings() {
    try {
      const data = await fetchGlobalSettings();
      setGlobalSettings(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load global settings (admin)');
      setGlobalSettings({});
    }
  }

  // normalize helpers
  const read = (key, fallback='') => (mySettings && mySettings[key] !== undefined ? mySettings[key] : fallback);
  const readGlobal = (key, fallback='') => (globalSettings && globalSettings[key] !== undefined ? globalSettings[key] : fallback);

  if (!mySettings) {
    return <div className="p-8">Loading settings...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tab.Group>
        <Tab.List className="flex space-x-2 border-b mb-6">
          <Tab className={({ selected }) => classNames("py-2 px-4 -mb-px cursor-pointer", selected ? "border-b-2 border-blue-600 font-semibold text-blue-600" : "text-gray-600")}>Profile</Tab>
          <Tab className={({ selected }) => classNames("py-2 px-4 -mb-px cursor-pointer", selected ? "border-b-2 border-blue-600 font-semibold text-blue-600" : "text-gray-600")}>System</Tab>
          <Tab className={({ selected }) => classNames("py-2 px-4 -mb-px cursor-pointer", selected ? "border-b-2 border-blue-600 font-semibold text-blue-600" : "text-gray-600")}>Notifications</Tab>
          {isAdmin && <Tab className={({ selected }) => classNames("py-2 px-4 -mb-px cursor-pointer", selected ? "border-b-2 border-blue-600 font-semibold text-blue-600" : "text-gray-600")}>Admin</Tab>}
        </Tab.List>

        <Tab.Panels>
          {/* PROFILE TAB */}
          <Tab.Panel>
            <div className="bg-white p-6 rounded shadow">
              <Formik
                enableReinitialize
                initialValues={{
                  fullName: read('fullName', ''),
                  email: read('email', ''),
                  changePassword: false,
                  newPassword: '',
                }}
                validationSchema={profileSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const payload = {
                      fullName: values.fullName,
                      email: values.email
                    };
                    await updateMySettings(payload);
                    toast.success('Profile updated');
                    loadSettings();
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to save profile');
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ values, handleChange, isSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium">Full name</label>
                      <Field name="fullName" className="mt-1 block w-full border rounded p-2" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Email</label>
                      <Field name="email" type="email" className="mt-1 block w-full border rounded p-2" />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
                        Save Profile
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Tab.Panel>

          {/* SYSTEM TAB */}
          <Tab.Panel>
            <div className="bg-white p-6 rounded shadow">
              <Formik
                enableReinitialize
                initialValues={{
                  timezone: read('timezone', Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'),
                  language: read('language', 'en'),
                  defaultWeightCategory: read('defaultWeightCategory','SMALL'),
                  theme: read('theme','light'),
                }}
                validationSchema={systemSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    await updateMySettings(values);
                    toast.success('System preferences saved');
                    loadSettings();
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to save preferences');
                  } finally { setSubmitting(false); }
                }}
              >
                {({ values, handleChange, isSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium">Timezone</label>
                      <Field name="timezone" className="mt-1 block w-full border rounded p-2" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Language</label>
                      <Field as="select" name="language" className="mt-1 block w-full border rounded p-2">
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                      </Field>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Default Parcel Weight</label>
                      <Field as="select" name="defaultWeightCategory" className="mt-1 block w-full border rounded p-2">
                        <option value="SMALL">Small</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LARGE">Large</option>
                      </Field>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">Theme</label>
                      <Field as="select" name="theme" className="mt-1 block w-full border rounded p-2">
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </Field>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
                        Save System Settings
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Tab.Panel>

          {/* NOTIFICATIONS TAB */}
          <Tab.Panel>
            <div className="bg-white p-6 rounded shadow">
              <Formik
                enableReinitialize
                initialValues={{
                  emailNotifications: read('emailNotifications', 'true') === 'true' || read('emailNotifications', true) === true,
                  smsNotifications: read('smsNotifications', 'false') === 'true' || read('smsNotifications', false) === true,
                }}
                validationSchema={notificationsSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    // store booleans as strings or booleans - service stores stringified value
                    const payload = {
                      emailNotifications: values.emailNotifications,
                      smsNotifications: values.smsNotifications
                    };
                    await updateMySettings(payload);
                    toast.success('Notification preferences saved');
                    loadSettings();
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to save notification preferences');
                  } finally { setSubmitting(false); }
                }}
              >
                {({ values, handleChange, isSubmitting }) => (
                  <Form className="space-y-4">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <Field type="checkbox" name="emailNotifications" />
                        <span>Email Notifications</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Field type="checkbox" name="smsNotifications" />
                        <span>SMS Notifications</span>
                      </label>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
                        Save Notifications
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Tab.Panel>

          {/* ADMIN TAB */}
          {isAdmin && (
            <Tab.Panel>
              <div className="bg-white p-6 rounded shadow">
                <h3 className="text-lg font-semibold mb-4">Global Settings (Admin)</h3>

                <Formik
                  enableReinitialize
                  initialValues={{
                    allowedStatuses: JSON.stringify(globalSettings || {}, null, 2)
                  }}
                  validationSchema={adminSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      // Accept JSON string and update global keys
                      const parsed = JSON.parse(values.allowedStatuses || '{}');
                      await updateGlobalSettings(parsed);
                      toast.success('Global settings saved');
                      loadGlobalSettings();
                    } catch (err) {
                      console.error(err);
                      toast.error('Invalid JSON or save failed');
                    } finally { setSubmitting(false); }
                  }}
                >
                  {({ values, handleChange, isSubmitting }) => (
                    <Form>
                      <div>
                        <label className="block text-sm font-medium">Global settings JSON</label>
                        <Field as="textarea" name="allowedStatuses" rows="8" className="mt-1 block w-full border rounded p-2 font-mono text-sm" />
                        <p className="text-xs text-gray-500 mt-1">Edit global settings as JSON. Example: {"{ \"defaultWeightCategory\": \"MEDIUM\" }"}</p>
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
                          Save Global Settings
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </Tab.Panel>
          )}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default SettingsPage;
