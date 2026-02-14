import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient";
import { formatProjectDate } from "../utils/date";

export default function Dashboard() {
  const [metrics, setMetrics] = useState([
    { title: "মোট কর্মী", value: "0" },
    { title: "আজ উপস্থিত", value: "0" },
    { title: "আজ অনুপস্থিত", value: "0" },
    { title: "চলমান ছুটি", value: "0" }
  ]);
  const [leaveSummary, setLeaveSummary] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const loadMetrics = async () => {
      if (!supabase) {
        return;
      }

      const today = new Date().toISOString().slice(0, 10);

      const [employeesCount, presentCount, absentCount, leaveCount] = await Promise.all([
        supabase.from("employees").select("id", { count: "exact", head: true }),
        supabase
          .from("attendance")
          .select("id", { count: "exact", head: true })
          .eq("date", today)
          .eq("status", "Present"),
        supabase
          .from("attendance")
          .select("id", { count: "exact", head: true })
          .eq("date", today)
          .eq("status", "Absent"),
        supabase
          .from("leave_requests")
          .select("id", { count: "exact", head: true })
          .eq("status", "Approved")
          .lte("start_date", today)
          .or(`end_date.is.null,end_date.gte.${today}`)
      ]);

      setMetrics([
        { title: "মোট কর্মী", value: String(employeesCount.count ?? 0) },
        { title: "আজ উপস্থিত", value: String(presentCount.count ?? 0) },
        { title: "আজ অনুপস্থিত", value: String(absentCount.count ?? 0) },
        { title: "চলমান ছুটি", value: String(leaveCount.count ?? 0) }
      ]);
    };

    const loadLeaveSummary = async () => {
      if (!supabase) {
        return;
      }

      const { data } = await supabase
        .from("leave_requests")
        .select("leave_type, status");

      if (data) {
        const summary = data.reduce((acc, item) => {
          const type = item.leave_type || "অন্যান্য";
          if (!acc[type]) {
            acc[type] = { type, used: 0, total: 0 };
          }
          if (item.status === "Approved") {
            acc[type].used += 1;
          }
          acc[type].total += 1;
          return acc;
        }, {});

        setLeaveSummary(Object.values(summary));
      }
    };

    const loadRecentActivities = async () => {
      if (!supabase) {
        return;
      }

      const { data } = await supabase
        .from("employees")
        .select("name, department_id, departments(name), created_at")
        .order("created_at", { ascending: false })
        .limit(5);

      if (data) {
        const activities = data.map((row) => ({
          title: "নতুন কর্মী যোগ হয়েছে",
          detail: `${row.name}${row.departments?.name ? ` - ${row.departments.name}` : ""}`,
          time: row.created_at ? formatProjectDate(row.created_at) : "-"
        }));
        setRecentActivities(activities);
      }
    };

    loadMetrics();
    loadLeaveSummary();
    loadRecentActivities();
  }, []);

  const leaveStats = useMemo(
    () =>
      leaveSummary.map((item) => ({
        ...item,
        remaining: Math.max(0, item.total - item.used)
      })),
    [leaveSummary]
  );

  return (
    <div>
      <header className="page-header">
        <div>
          <h2>ড্যাশবোর্ড</h2>
          <p>আপনার HRM কার্যক্রমের সারাংশ দেখুন।</p>
        </div>
        <button className="button">রিপোর্ট ডাউনলোড</button>
      </header>

      <section className="card-grid section">
        {metrics.map((metric) => (
          <div key={metric.title} className="card">
            <p>{metric.title}</p>
            <h3>{metric.value}</h3>
          </div>
        ))}
      </section>

      <section className="section card">
        <h3>ছুটি ব্যালেন্স সারাংশ</h3>
        {leaveStats.length === 0 ? (
          <p>কোন ছুটির সারাংশ পাওয়া যায়নি।</p>
        ) : (
          <div className="card-grid">
            {leaveStats.map((item) => (
              <div key={item.type}>
                <p>{item.type}</p>
                <p>
                  ব্যবহৃত {item.used}/{item.total} • বাকি {item.remaining}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section card">
        <h3>সাম্প্রতিক কার্যক্রম</h3>
        {recentActivities.length === 0 ? (
          <p>কোন কার্যক্রম পাওয়া যায়নি।</p>
        ) : (
          <ul>
            {recentActivities.map((activity) => (
              <li key={`${activity.title}-${activity.detail}`} style={{ marginBottom: "10px" }}>
                <strong>{activity.title}</strong>
                <div>{activity.detail}</div>
                <small>{activity.time}</small>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
