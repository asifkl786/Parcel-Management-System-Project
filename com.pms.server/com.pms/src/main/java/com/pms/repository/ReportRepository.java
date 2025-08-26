package com.pms.repository;

import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pms.dto.ReportSummaryProjection;
import com.pms.entity.Parcel;

@Repository
public interface ReportRepository extends JpaRepository<Parcel, Long> {

	@Query(value = """
		    SELECT 
		        COUNT(*) AS totalParcels,
		        SUM(CASE WHEN status = 'DELIVERED' THEN 1 ELSE 0 END) AS deliveredCount,
		        SUM(CASE WHEN status = 'IN_TRANSIT' THEN 1 ELSE 0 END) AS inTransitCount,
		        SUM(CASE WHEN status = 'RETURNED' THEN 1 ELSE 0 END) AS returnedCount,
		        SUM(total_value) AS totalRevenue,
		        AVG(shipping_cost) AS averageShippingCost,
		        DATE_FORMAT(received_at, '%Y-%m') AS monthYear,
		        COUNT(*) AS monthlyCount
		    FROM parcels
		    WHERE received_at BETWEEN :startDate AND :endDate
		    GROUP BY DATE_FORMAT(received_at, '%Y-%m')
		""", nativeQuery = true)
		List<ReportSummaryProjection> getSummaryReportMetrics(
		    @Param("startDate") Instant startDate,
		    @Param("endDate") Instant endDate);

	
	// This query find Payment Method Distribution
	@Query("SELECT p.paymentMethod, COUNT(p) FROM Parcel p " +
		       "WHERE p.receivedAt BETWEEN :startDate AND :endDate " +
		       "GROUP BY p.paymentMethod")
		List<Object[]> findPaymentMethodCounts(@Param("startDate") Instant start, @Param("endDate") Instant end);

		// This query for Status Report
		@Query("SELECT p.status, COUNT(p) FROM Parcel p GROUP BY p.status")
		List<Object[]> findParcelStatusCounts();

		@Query("SELECT COUNT(p) FROM Parcel p")
		long findTotalParcelCount();

		// This query for Delivery performance
		@Query("SELECT p FROM Parcel p WHERE " +
			       "MONTH(p.deliveredAt) = :month AND YEAR(p.deliveredAt) = :year " +
			       "AND (:city IS NULL OR p.destinationCity = :city) " +
			       "AND (:parcelType IS NULL OR p.parcelType = :parcelType) " +
			       "AND p.deliveredAt IS NOT NULL")
			List<Parcel> findDeliveredParcelsForReport(
			        @Param("month") Integer month,
			        @Param("year") Integer year,
			        @Param("city") String city,
			        @Param("parcelType") String parcelType);


}