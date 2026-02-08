import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const fallbackEmployees = [
  {
    id: 101,
    name: "সুমাইয়া ইসলাম",
    pf_number: "PF-1001",
    mobile_number: "01711-000000",
    designation: "HR Officer",
    dept: "মানব সম্পদ",
    job_grade: "G-5",
    basic_salary: 35000
  },
  {
    id: 102,
    name: "রেজাউল করিম",
    pf_number: "PF-1002",
    mobile_number: "01811-000000",
    designation: "Software Engineer",
    dept: "আইটি",
    job_grade: "G-6",
    basic_salary: 50000
  }
];

export default function Employees() {
  const [employees, setEmployees] = useState(fallbackEmployees);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadEmployees = async () => {
      if (!supabase) {
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("employees")
        .select(
          "id, name, pf_number, mobile_number, designation, job_grade, basic_salary, departments(name)"
        )
        .order("id", { ascending: false });

      if (!error && data) {
        const normalized = data.map((row) => ({
          id: row.id,
          name: row.name,
          pf_number: row.pf_number,
          mobile_number: row.mobile_number,
          designation: row.designation,
          dept: row.departments?.name ?? "-",
          job_grade: row.job_grade,
          basic_salary: row.basic_salary
        }));
        setEmployees(normalized);
      }

      setLoading(false);
    };

    loadEmployees();
  }, []);

  return (
    <div>
      <header className="page-header">
        <div>
          <h2>কর্মী তালিকা</h2>
          <p>কর্মীদের তথ্য সংরক্ষণ ও হালনাগাদ করুন।</p>
        </div>
        <button className="button">নতুন কর্মী</button>
      </header>

      <section className="section card">
        <h3>দ্রুত যোগ করুন</h3>
        <div className="form-grid">
          <label className="field">
            নাম
            <input placeholder="কর্মীর নাম" />
          </label>
          <label className="field">
            PF নম্বর
            <input placeholder="PF-1005" />
          </label>
          <label className="field">
            বিভাগ
            <select>
              <option>মানব সম্পদ</option>
              <option>আইটি</option>
              <option>হিসাব</option>
            </select>
          </label>
          <label className="field">
            পদবী
            <input placeholder="Designation" />
          </label>
        </div>
      </section>

      <section className="section">
        <table className="table">
          <thead>
            <tr>
              <th>নাম</th>
              <th>PF</th>
              <th>বিভাগ</th>
              <th>পদবী</th>
              <th>গ্রেড</th>
              <th>বেসিক</th>
              <th>মোবাইল</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.pf_number}</td>
                <td>{emp.dept}</td>
                <td>{emp.designation}</td>
                <td>{emp.job_grade}</td>
                <td>{emp.basic_salary.toLocaleString("bn-BD")}</td>
                <td>{emp.mobile_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p>লোড হচ্ছে...</p>}
      </section>
    </div>
  );
}
