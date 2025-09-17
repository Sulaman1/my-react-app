import React, { useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { FaChartBar, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ReportStats = ({ stats }) => {
	const [isVisible, setIsVisible] = useState(false);

	if (!stats || !stats.columns || !stats.data || stats.data.length === 0) return null;

	const statData = stats.data[0];
	const columns = stats.columns;

	const StatCard = ({ column, value, index }) => {
		const colors = ['primary', 'info', 'success', 'warning', 'danger'];
		const color = colors[index % colors.length];

		return (
			<Card className={`border-${color} shadow-sm h-100 stat-card`}>
				<Card.Body className="p-2">
					<div className="text-muted small mb-1">{column.displayName}</div>
					<div className={`text-${color} fw-bold h4 mb-0`}>{value}</div>
				</Card.Body>
			</Card>
		);
	};

	return (
		<div className="report-stats mb-4">
			<div className="d-flex align-items-center mb-3">
				<Button 
					variant="outline-primary" 
					onClick={() => setIsVisible(!isVisible)}
					className="d-flex align-items-center gap-2"
				>
					<FaChartBar />
					Statistics
					{isVisible ? <FaChevronUp /> : <FaChevronDown />}
				</Button>
			</div>

			<div className={`stats-container ${isVisible ? 'show' : ''}`}>
				<Row className="g-2">
					{columns.map((column, index) => (
						<Col key={column.key} xs={6} sm={4} md={3} lg={2}>
							<StatCard 
								column={column}
								value={statData[column.key]}
								index={index}
							/>
						</Col>
					))}
				</Row>
			</div>

			<style jsx>{`
				.stats-container {
					max-height: 0;
					overflow: hidden;
					transition: max-height 0.5s ease-out;
					opacity: 0;
				}

				.stats-container.show {
					max-height: 2000px;
					opacity: 1;
					transition: max-height 0.5s ease-in, opacity 0.3s ease-in;
				}

				.stat-card {
					transform: translateY(20px);
					opacity: 0;
					transition: transform 0.3s ease-out, opacity 0.3s ease-out;
					min-height: 70px !important;
				}

				.stats-container.show .stat-card {
					transform: translateY(0);
					opacity: 1;
				}

				.stats-container.show .stat-card:nth-child(1) { transition-delay: 0.1s; }
				.stats-container.show .stat-card:nth-child(2) { transition-delay: 0.15s; }
				.stats-container.show .stat-card:nth-child(3) { transition-delay: 0.2s; }
				.stats-container.show .stat-card:nth-child(4) { transition-delay: 0.25s; }
				.stats-container.show .stat-card:nth-child(5) { transition-delay: 0.3s; }
				.stats-container.show .stat-card:nth-child(6) { transition-delay: 0.35s; }

				.stat-card .h4 {
					font-size: 1.25rem;
					line-height: 1.2;
				}

				.stat-card .small {
					font-size: 0.75rem;
					line-height: 1.2;
				}

				/* Reduce gap between cards */
				.g-2 {
					--bs-gutter-x: 0.5rem;
					--bs-gutter-y: 0.5rem;
				}
			`}</style>
		</div>
	);
};

export default ReportStats;
