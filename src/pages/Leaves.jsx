import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const statusOptions = [
  { value: "Pending", label: "অপেক্ষমান" },
  { value: "Approved", label: "অনুমোদিত" },
  { value: "Rejected", label: "বাতিল" }
];

export default function Leaves() {
  const [requests, setRequests] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingHolidays, setLoadingHolidays] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [editingHolidayId, setEditingHolidayId] = useState(null);
  const [requestForm, setRequestForm] = useState({
    employee: "",
    type: "",
    start_date: "",
    end_date: "",
    status: "Pending"
  });
  const [holidayForm, setHolidayForm] = useState({
    date: "",
    title: ""
  });
  const [requestError, setRequestError] = useState("");
  const [holidayError, setHolidayError] = useState("");

  useEffect(() => {
    const loadRequests = async () => {
      if (!supabase) {
        return;
      }

      setLoadingRequests(true);
      const { data, error } = await supabase
        .from("leave_requests")
        .select("id, employee, type, start_date, end_date, status")
        .order("start_date", { ascending: false });

      if (!error && data) {
        setRequests(data);
      }

      setLoadingRequests(false);
    };

    const loadHolidays = async () => {
      if (!supabase) {
        return;
      }

      setLoadingHolidays(true);
      const { data, error } = await supabase
        .from("holidays")
        .select("id, date, title")
        .order("date");

      if (!error && data) {
        setHolidays(data);
      }

      setLoadingHolidays(false);
    };

    const loadEmployees = async () => {
      if (!supabase) {
        return;
      }

      setLoadingEmployees(true);
      const { data, error } = await supabase
        .from("employees")
        .select("id, name")
        .order("name");

      if (!error && data) {
        setEmployees(data);
      }

      setLoadingEmployees(false);
    };

    loadRequests();
    loadHolidays();
    loadEmployees();
  }, []);

  const resetRequestForm = () => {
    setRequestForm({
      employee: "",
      type: "",
      start_date: "",
      end_date: "",
      status: "Pending"
    });
    setEditingRequestId(null);
    setRequestError("");
  };

  const resetHolidayForm = () => {
    setHolidayForm({ date: "", title: "" });
    setEditingHolidayId(null);
    setHolidayError("");
  };

  const handleRequestChange = (event) => {
    const { name, value } = event.target;
    setRequestForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleHolidayChange = (event) => {
    const { name, value } = event.target;
    setHolidayForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequestEdit = (request) => {
    setRequestForm({
      employee: request.employee ?? "",
      type: request.type ?? "",
      start_date: request.start_date ?? "",
      end_date: request.end_date ?? "",
      status: request.status ?? "Pending"
    });
    setEditingRequestId(request.id);
    setRequestError("");
  };

  const handleHolidayEdit = (holiday) => {
    setHolidayForm({ date: holiday.date ?? "", title: holiday.title ?? "" });
    setEditingHolidayId(holiday.id);
    setHolidayError("");
  };

  const handleRequestDelete = async (requestId) => {
    if (!supabase) {
      setRequestError("Supabase কনফিগার হয়নি।");
      return;
    }

    const { error: deleteError } = await supabase
      .from("leave_requests")
      .delete()
      .eq("id", requestId);

    if (deleteError) {
      setRequestError(`ছুটি আবেদন মুছতে সমস্যা হয়েছে: ${deleteError.message}`);
      return;
    }

    setRequestError("");
    setRequests((prev) => prev.filter((request) => request.id !== requestId));
  };

  const handleHolidayDelete = async (holidayId) => {
    if (!supabase) {
      setHolidayError("Supabase কনফিগার হয়নি।");
      return;
    }

    const { error: deleteError } = await supabase
      .from("holidays")
      .delete()
      .eq("id", holidayId);

    if (deleteError) {
      setHolidayError(`হলিডে মুছতে সমস্যা হয়েছে: ${deleteError.message}`);
      return;
    }

    setHolidayError("");
    setHolidays((prev) => prev.filter((holiday) => holiday.id !== holidayId));
  };

  const handleRequestSubmit = async (event) => {
    event.preventDefault();

    if (!requestForm.employee.trim() || !requestForm.type.trim()) {
      setRequestError("কর্মী এবং ছুটির ধরন লিখুন।");
      return;
    }

    if (!requestForm.start_date) {
      setRequestError("ছুটির শুরুর তারিখ নির্বাচন করুন।");
      return;
    }

    setRequestError("");

    if (!supabase) {
      setRequestError("Supabase কনফিগার হয়নি।");
      return;
    }

    if (editingRequestId) {
      const updated = {
        id: editingRequestId,
        employee: requestForm.employee.trim(),
        type: requestForm.type.trim(),
        start_date: requestForm.start_date,
        end_date: requestForm.end_date || null,
        status: requestForm.status
      };

      const { error: updateError } = await supabase
        .from("leave_requests")
        .update({
          employee: updated.employee,
          type: updated.type,
          start_date: updated.start_date,
          end_date: updated.end_date,
          status: updated.status
        })
        .eq("id", editingRequestId);

      if (updateError) {
        setRequestError(`ছুটি আবেদন আপডেট হয়নি: ${updateError.message}`);
        return;
      }

      setRequests((prev) =>
        prev.map((request) =>
          request.id === editingRequestId ? { ...request, ...updated } : request
        )
      );

      resetRequestForm();
      return;
    }

    const { data, error: insertError } = await supabase
      .from("leave_requests")
      .insert({
        employee: requestForm.employee.trim(),
        type: requestForm.type.trim(),
        start_date: requestForm.start_date,
        end_date: requestForm.end_date || null,
        status: requestForm.status
      })
      .select("id, employee, type, start_date, end_date, status")
      .single();

    if (insertError) {
      setRequestError(`ছুটি আবেদন সংরক্ষণ হয়নি: ${insertError.message}`);
      return;
    }

    if (data) {
      setRequests((prev) => [data, ...prev]);
    }

    resetRequestForm();
  };

  const handleHolidaySubmit = async (event) => {
    event.preventDefault();

    if (!holidayForm.date || !holidayForm.title.trim()) {
      setHolidayError("তারিখ এবং ছুটির শিরোনাম লিখুন।");
      return;
    }

    setHolidayError("");

    if (!supabase) {
      setHolidayError("Supabase কনফিগার হয়নি।");
      return;
    }

    if (editingHolidayId) {
      const updated = {
        id: editingHolidayId,
        date: holidayForm.date,
        title: holidayForm.title.trim()
      };

      const { error: updateError } = await supabase
        .from("holidays")
        .update({ date: updated.date, title: updated.title })
        .eq("id", editingHolidayId);

      if (updateError) {
        setHolidayError(`হলিডে আপডেট হয়নি: ${updateError.message}`);
        return;
      }

      setHolidays((prev) =>
        prev.map((holiday) =>
          holiday.id === editingHolidayId ? { ...holiday, ...updated } : holiday
        )
      );

      resetHolidayForm();
      return;
    }

    const { data, error: insertError } = await supabase
      .from("holidays")
      .insert({ date: holidayForm.date, title: holidayForm.title.trim() })
      .select("id, date, title")
      .single();

    if (insertError) {
      setHolidayError(`হলিডে সংরক্ষণ হয়নি: ${insertError.message}`);
      return;
    }

    if (data) {
      setHolidays((prev) => [data, ...prev]);
    }

    resetHolidayForm();
  };

  const renderDateRange = (request) => {
    if (!request.start_date) {
      return "-";
    }

    const start = new Date(request.start_date).toLocaleDateString("bn-BD");
    if (!request.end_date || request.end_date === request.start_date) {
      return start;
    }

    const end = new Date(request.end_date).toLocaleDateString("bn-BD");
    return `${start} - ${end}`;
  };

  const employeeNames = employees.map((employee) => employee.name).filter(Boolean);
  const isSelectedEmployeeMissing =
    requestForm.employee && !employeeNames.includes(requestForm.employee);

  return (
    <div>
      <header className="page-header">
        <div>
          <h2>ছুটি ব্যবস্থাপনা</h2>
          <p>ছুটি আবেদন, অনুমোদন এবং ক্যালেন্ডার হ্যান্ডল করুন।</p>
        </div>
        <button className="button" type="button" onClick={resetRequestForm}>
          নতুন আবেদন
        </button>
      </header>

      <section className="section card">
        <h3>{editingRequestId ? "আবেদন হালনাগাদ করুন" : "নতুন ছুটি আবেদন"}</h3>
        <form className="form-grid" onSubmit={handleRequestSubmit}>
          <label className="field">
            কর্মী
            <select
              name="employee"
              value={requestForm.employee}
              onChange={handleRequestChange}
              disabled={loadingEmployees}
            >
              <option value="">
                {loadingEmployees ? "লোড হচ্ছে..." : "কর্মী নির্বাচন করুন"}
              </option>
              {isSelectedEmployeeMissing && (
                <option value={requestForm.employee}>{requestForm.employee}</option>
              )}
              {employees.map((employee) => (
                <option key={employee.id} value={employee.name ?? ""}>
                  {employee.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            ছুটির ধরন
            <input
              name="type"
              value={requestForm.type}
              onChange={handleRequestChange}
              placeholder="ক্যাজুয়াল / সিক"
            />
          </label>
          <label className="field">
            শুরু
            <input
              name="start_date"
              type="date"
              value={requestForm.start_date}
              onChange={handleRequestChange}
            />
          </label>
          <label className="field">
            শেষ
            <input
              name="end_date"
              type="date"
              value={requestForm.end_date}
              onChange={handleRequestChange}
            />
          </label>
          <label className="field">
            অবস্থা
            <select name="status" value={requestForm.status} onChange={handleRequestChange}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="field">
            <span>অ্যাকশন</span>
            <div className="inline-actions">
              <button className="button" type="submit">
                {editingRequestId ? "আপডেট করুন" : "সংরক্ষণ করুন"}
              </button>
              {editingRequestId && (
                <button className="button secondary" type="button" onClick={resetRequestForm}>
                  বাতিল
                </button>
              )}
            </div>
          </div>
        </form>
        {requestError && <p className="form-error">{requestError}</p>}
      </section>

      <section className="section">
        <table className="table">
          <thead>
            <tr>
              <th>কর্মী</th>
              <th>ধরন</th>
              <th>সময়কাল</th>
              <th>অবস্থা</th>
              <th>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={5}>কোন ছুটির আবেদন পাওয়া যায়নি।</td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.employee}</td>
                  <td>{request.type}</td>
                  <td>{renderDateRange(request)}</td>
                  <td>
                    <span
                      className={`badge ${
                        request.status === "Approved"
                          ? "success"
                          : request.status === "Rejected"
                          ? "danger"
                          : "warning"
                      }`}
                    >
                      {statusOptions.find((option) => option.value === request.status)?.label ??
                        request.status}
                    </span>
                  </td>
                  <td>
                    <div className="inline-actions">
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => handleRequestEdit(request)}
                      >
                        সম্পাদনা
                      </button>
                      <button
                        className="button danger"
                        type="button"
                        onClick={() => handleRequestDelete(request.id)}
                      >
                        মুছুন
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {loadingRequests && <p>লোড হচ্ছে...</p>}
      </section>

      <section className="section card">
        <h3>{editingHolidayId ? "হলিডে আপডেট করুন" : "নতুন হলিডে"}</h3>
        <form className="form-grid" onSubmit={handleHolidaySubmit}>
          <label className="field">
            তারিখ
            <input
              name="date"
              type="date"
              value={holidayForm.date}
              onChange={handleHolidayChange}
            />
          </label>
          <label className="field">
            শিরোনাম
            <input
              name="title"
              value={holidayForm.title}
              onChange={handleHolidayChange}
              placeholder="উদাহরণ: বিজয় দিবস"
            />
          </label>
          <div className="field">
            <span>অ্যাকশন</span>
            <div className="inline-actions">
              <button className="button" type="submit">
                {editingHolidayId ? "আপডেট করুন" : "সংরক্ষণ করুন"}
              </button>
              {editingHolidayId && (
                <button className="button secondary" type="button" onClick={resetHolidayForm}>
                  বাতিল
                </button>
              )}
            </div>
          </div>
        </form>
        {holidayError && <p className="form-error">{holidayError}</p>}
      </section>

      <section className="section">
        <table className="table">
          <thead>
            <tr>
              <th>তারিখ</th>
              <th>হলিডে</th>
              <th>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {holidays.length === 0 ? (
              <tr>
                <td colSpan={3}>কোন হলিডে পাওয়া যায়নি।</td>
              </tr>
            ) : (
              holidays.map((holiday) => (
                <tr key={holiday.id}>
                  <td>{new Date(holiday.date).toLocaleDateString("bn-BD")}</td>
                  <td>{holiday.title}</td>
                  <td>
                    <div className="inline-actions">
                      <button
                        className="button secondary"
                        type="button"
                        onClick={() => handleHolidayEdit(holiday)}
                      >
                        সম্পাদনা
                      </button>
                      <button
                        className="button danger"
                        type="button"
                        onClick={() => handleHolidayDelete(holiday.id)}
                      >
                        মুছুন
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {loadingHolidays && <p>লোড হচ্ছে...</p>}
      </section>
    </div>
  );
}
