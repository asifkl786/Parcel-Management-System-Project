package com.pms.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.pms.entity.Parcel;


@Repository
public interface ParcelRepository extends JpaRepository<Parcel, Long>,JpaSpecificationExecutor<Parcel>  {
    Optional<Parcel> findByTrackingNumber(String trackingNumber);
    Page<Parcel> findAll(Pageable pageable);
    // Example of filtered pagination
    Page<Parcel> findByStatus(String status, Pageable pageable);
}
