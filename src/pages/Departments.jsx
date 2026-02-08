import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const fallbackDepartments = [
  { id: 1, name: "মানব সম্পদ", created_at: "2024-07-01" },
  { id: 2, name: "হিসাব", created_at: "2024-07-03" },
  { id: 3, name: "আইটি", created_at: "2024-07-05" }
];

export default function Departments() {
  const [departments, setDepartments] = useState(fallbackDepartments);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDepartments = async () => {
      if (!supabase) {
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("departments")
        .select("id, name, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setDepartments(data);
      }

      setLoading(false);
    };

    loadDepartments();
  }, []);

  return (
    <div>
      <header className="page-header">
        <div>
          <h2>ডিপার্টমেন্ট</h2>
          <p>বিভাগের তালিকা এবং নতুন বিভাগ যোগ করুন।</p>
        </div>
        <button className="button">নতুন বিভাগ</button>
      </header>

      <section className="section card">
        <h3>নতুন বিভাগ যোগ করুন</h3>
        <div className="form-grid">
          <label className="field">
            বিভাগের নাম
            <input placeholder="উদাহরণ: প্রশাসন" />
          </label>
          <label className="field">
            বিভাগের কোড
            <input placeholder="ADM-001" />
          </label>
          <label className="field">
            ম্যানেজার
            <input placeholder="ম্যানেজার নাম" />
          </label>
        </div>
      </section>

      <section className="section">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>নাম</th>
              <th>তৈরির তারিখ</th>
              <th>অবস্থা</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id}>
                <td>{dept.id}</td>
                <td>{dept.name}</td>
                <td>{new Date(dept.created_at).toLocaleDateString("bn-BD")}</td>
                <td>
                  <span className="badge success">সক্রিয়</span>
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
