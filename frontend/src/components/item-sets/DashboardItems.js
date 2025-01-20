import React, { useEffect, useState, useCallback } from "react";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import axiosInstance from "../../api/axiosInstance"; // Adjust the path as needed
import { Line } from "react-chartjs-2";
import SectionPreLoader from "../SectionPreloader";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
// Register the required components
ChartJS.register(
    CategoryScale, // For the x-axis
    LinearScale,   // For the y-axis
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
const DashboardItems = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState(null);

  // Fetch financial summary data
  const fetchSummaryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        return (window.location = `/login?logout=true`);
      }

      // Add Authorization header to axiosInstance
      axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

      const response = await axiosInstance.get("/api/financial-summary/");
      setSummaryData(response.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        return (window.location = `/login?logout=true`);
      } else {
        console.error("Error fetching financial summary:", err);
        setError(err.message || "Failed to fetch summary data.");
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchSummaryData();
  }, [fetchSummaryData]);

  if (loading) {
    return <SectionPreLoader />;
  }

  if (error) {
    return <SectionPreLoader message={error} retryCallBack={fetchSummaryData} />;
  }

  if (!summaryData) {
    return <div>No data available.</div>;
  }

  const { total_income, total_expense, total_balance, income_data, expense_data } = summaryData;

  // Prepare data for the graph
  const graphData = {
    labels: income_data.map((item) => item.created_at__date),
    datasets: [
      {
        label: "Income",
        data: income_data.map((item) => item.total),
        borderColor: "blue",
        backgroundColor: "rgba(0, 123, 255, 0.5)",
        fill: false,
        tension: 0.4,
      },
      {
        label: "Expenses",
        data: expense_data.map((item) => item.total),
        borderColor: "red",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      x: {
        title: { display: true, text: "Date" },
      },
      y: {
        title: { display: true, text: "Amount (RWF)" },
      },
    },
  };

  return (
    <div className="two-col-holder">
      <div className="dash-board-current-balance-hl two-col-i-big">
        <div className="dash-board-current-balance native-card">
          <div className="dash-board-current-balance-inner-upper">
            <h5>Total balance</h5>
            <h1>RWF {total_balance.toLocaleString()}</h1>
          </div>
          <div className="dash-board-current-balance-inner-down">
            <div className="dash-board-current-ex-in">
              <span>
                <ArrowDropUpRoundedIcon className="blue-icon" /> Income
              </span>
              <span>RWF {total_income.toLocaleString()}</span>
            </div>
            <div className="dash-board-current-ex-in">
              <span>
                <ArrowDropDownRoundedIcon className="red-icon" /> Expenses
              </span>
              <span>RWF {total_expense.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="dash-board-recent-transactions native-card">
          <h4>Income - Expenses Graph</h4>
          <div className="dash-board-recent-transactions-graph">
            <Line data={graphData} options={graphOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardItems;
