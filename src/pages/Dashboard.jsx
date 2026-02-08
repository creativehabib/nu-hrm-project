import { useMemo } from "react";

const metrics = [
  { title: "মোট কর্মী", value: "128" },
  { title: "আজ উপস্থিত", value: "118" },
  { title: "আজ অনুপস্থিত", value: "10" },
  { title: "চলমান ছুটি", value: "6" }
];

const recentActivities = [
  {
    title: "নতুন কর্মী যোগ হয়েছে",
    detail: "আলমগীর কবির - আইটি বিভাগ",
    time: "২০ মিনিট আগে"
  },
  {
    title: "বেতন প্রক্রিয়াকরণ",
    detail: "সেপ্টেম্বর মাসের বেতন অনুমোদিত",
    time: "১ ঘণ্টা আগে"
  },
  {
    title: "ছুটি আবেদন",
    detail: "মাহমুদা (হিসাব বিভাগ) - ৩ দিনের ছুটি",
    time: "আজ"
  }
];

const leaveSummary = [
  { type: "ক্যাজুয়াল", used: 4, total: 10 },
  { type: "সিক", used: 2, total: 7 },
  { type: "আনপেইড", used: 1, total: 5 }
];

export default function Dashboard() {
  const leaveStats = useMemo(
    () =>
      leaveSummary.map((item) => ({
        ...item,
        remaining: item.total - item.used
      })),
    []
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
      </section>

      <section className="section card">
        <h3>সাম্প্রতিক কার্যক্রম</h3>
        <ul>
          {recentActivities.map((activity) => (
            <li key={activity.title} style={{ marginBottom: "10px" }}>
              <strong>{activity.title}</strong>
              <div>{activity.detail}</div>
              <small>{activity.time}</small>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
