const requests = [
  {
    id: 1,
    employee: "মাহমুদা",
    type: "ক্যাজুয়াল",
    range: "১৫-১৭ সেপ্টেম্বর",
    status: "Pending"
  },
  {
    id: 2,
    employee: "সাজেদুল",
    type: "সিক",
    range: "১০ সেপ্টেম্বর",
    status: "Approved"
  }
];

const holidays = [
  { date: "2024-10-13", title: "দুর্গাপূজা" },
  { date: "2024-12-16", title: "বিজয় দিবস" }
];

export default function Leaves() {
  return (
    <div>
      <header className="page-header">
        <div>
          <h2>ছুটি ব্যবস্থাপনা</h2>
          <p>ছুটি আবেদন, অনুমোদন এবং ক্যালেন্ডার হ্যান্ডল করুন।</p>
        </div>
        <button className="button">নতুন আবেদন</button>
      </header>

      <section className="section card">
        <h3>চলমান আবেদন</h3>
        <table className="table">
          <thead>
            <tr>
              <th>কর্মী</th>
              <th>ধরন</th>
              <th>সময়কাল</th>
              <th>অবস্থা</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.employee}</td>
                <td>{request.type}</td>
                <td>{request.range}</td>
                <td>
                  <span
                    className={`badge ${
                      request.status === "Approved" ? "success" : "warning"
                    }`}
                  >
                    {request.status === "Approved" ? "অনুমোদিত" : "অপেক্ষমান"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="section card">
        <h3>হলিডে ক্যালেন্ডার</h3>
        <ul>
          {holidays.map((holiday) => (
            <li key={holiday.date} style={{ marginBottom: "8px" }}>
              {new Date(holiday.date).toLocaleDateString("bn-BD")} —
              {" "}{holiday.title}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
