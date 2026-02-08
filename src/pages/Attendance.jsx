import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const fallbackAttendance = [
  {
    id: 201,
    emp_name: "সুমাইয়া ইসলাম",
    date: "2024-09-10",
    status: "Present"
  },
  {
    id: 202,
    emp_name: "রেজাউল করিম",
    date: "2024-09-10",
    status: "Absent"
  }
];

export default function Attendance() {
  const [records, setRecords] = useState(fallbackAttendance);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAttendance = async () => {
      if (!supabase) {
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("attendance")
        .select("id, date, status, employees(name)")
        .order("date", { ascending: false });

      if (!error && data) {
        const normalized = data.map((row) => ({
          id: row.id,
          emp_name: row.employees?.name ?? "-",
          date: row.date,
          status: row.status
        }));
        setRecords(normalized);
      }

      setLoading(false);
    };

    loadAttendance();
  }, []);

  return (
    <div>
      <header className="page-header">
        <div>
          <h2>হাজিরা ট্র্যাকিং</h2>
          <p>দৈনিক উপস্থিতি রেকর্ড পর্যবেক্ষণ করুন।</p>
        </div>
        <button className="button">নতুন হাজিরা</button>
      </header>

      <section className="section card">
        <h3>দ্রুত রেকর্ড</h3>
        <div className="form-grid">
          <label className="field">
            কর্মী
            <select>
              <option>সুমাইয়া ইসলাম</option>
              <option>রেজাউল করিম</option>
            </select>
          </label>
          <label className="field">
            তারিখ
            <input type="date" />
          </label>
          <label className="field">
            অবস্থা
            <select>
              <option>Present</option>
              <option>Absent</option>
            </select>
          </label>
        </div>
      </section>

      <section className="section">
        <table className="table">
          <thead>
            <tr>
              <th>কর্মী</th>
              <th>তারিখ</th>
              <th>অবস্থা</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.emp_name}</td>
                <td>{new Date(record.date).toLocaleDateString("bn-BD")}</td>
                <td>
                  <span
                    className={`badge ${
                      record.status === "Present" ? "success" : "warning"
                    }`}
                  >
                    {record.status === "Present" ? "উপস্থিত" : "অনুপস্থিত"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p>লোড হচ্ছে...</p>}
      </section>
    </div>
  );
}
