const paymentItems = [
  { label: "মূল বেতন", amount: "19,460.00" },
  { label: "এস.বি", amount: "2,919.00" },
  { label: "বাড়ি ভাড়া ভাতা", amount: "10,703.00" },
  { label: "মেডিকেল ভাতা", amount: "1,500.00" },
  { label: "মহরান ভাতা", amount: "0.00" },
  { label: "এ চার্জ ভাতা", amount: "0.00" },
  { label: "উৎসব ভাতা", amount: "0.00" },
  { label: "বই ভাতা", amount: "0.00" },
  { label: "টেলিফোন ভাতা", amount: "0.00" },
  { label: "শিশু ভাতা", amount: "500.00" },
  { label: "অন্যান্য", amount: "0.00" }
];

const deductionItems = [
  { label: "প্রভিডেন্ট ফান্ড", amount: "1,946.00" },
  { label: "প্রভিডেন্ট ফান্ড ঋণ", amount: "0.00" },
  { label: "হাসপাতাল ইন্স্যুরেন্স", amount: "219.00" },
  { label: "পিএফ লোন ইন্টারেস্ট", amount: "0.00" },
  { label: "গ্রুপ ইন্স্যুরেন্স", amount: "138.00" },
  { label: "বেনেভোলেন্ট ফান্ড", amount: "195.00" },
  { label: "ভেহিকেল চার্জ", amount: "500.00" },
  { label: "ব্যক্তিগত যান ব্যবহার", amount: "200.00" },
  { label: "হাউস লোন", amount: "18,333.00" },
  { label: "অ্যাসোসিয়েশন কন্ট্রিবিউশন", amount: "25.00" },
  { label: "ডিডাকশন অন স্যালারি", amount: "0.00" },
  { label: "অন্যান্য কন্ট্রিবিউশন/ডোনেশন", amount: "188.00" },
  { label: "ইনকাম ট্যাক্স", amount: "0.00" },
  { label: "টেলিফোন ডিডাকশন", amount: "0.00" },
  { label: "ইউটিলিটি বিল", amount: "0.00" },
  { label: "রেভিনিউ", amount: "10.00" },
  { label: "হাউস লোন ইন্টারেস্ট", amount: "0.00" },
  { label: "অন্যান্য", amount: "0.00" }
];

const totalPayment = "35,082.00";
const totalDeduction = "21,754.00";
const netPay = "13,328.00";

export default function SalarySheet() {
  const maxRows = Math.max(paymentItems.length, deductionItems.length);
  const rows = Array.from({ length: maxRows }, (_, index) => ({
    payment: paymentItems[index],
    deduction: deductionItems[index]
  }));

  return (
    <div>
      <header className="page-header print-hidden">
        <div>
          <h2>মাসিক বেতন শিট</h2>
          <p>জাতীয় বিশ্ববিদ্যালয়ের মাসিক বেতন বিলের একটি প্রিন্ট-ফ্রেন্ডলি ভিউ।</p>
        </div>
        <button className="button" onClick={() => window.print()}>
          প্রিন্ট করুন
        </button>
      </header>

      <section className="print-area salary-sheet">
        <div className="print-header salary-header">
          <div className="salary-title">
            <div className="logo-mark">NU</div>
            <div>
              <h1>National University</h1>
              <p>Gazipur-1704, Bangladesh</p>
              <h2>Monthly Pay Bill</h2>
              <p>For the Month of January, 2026</p>
            </div>
          </div>
          <div className="issue-meta">
            <p>Issue Date</p>
            <strong>26-JAN-26 • 12:24 PM</strong>
            <span>PF No: 2125</span>
          </div>
        </div>

        <div className="salary-meta">
          <div>
            <p>
              <strong>Name:</strong> Habibur Rahaman
            </p>
            <p>
              <strong>Department:</strong> College Inspection
            </p>
            <p>
              <strong>Bank Account:</strong> 0218801004162
            </p>
          </div>
          <div>
            <p>
              <strong>Designation:</strong> Administrative Officer
            </p>
            <p>
              <strong>Date of First Joining:</strong> 18/12/2014
            </p>
            <p>
              <strong>Joining at Current Position:</strong> 01/07/2020
            </p>
          </div>
        </div>

        <table className="print-table salary-table">
          <thead>
            <tr>
              <th>Head of Payment</th>
              <th>Amount (Taka)</th>
              <th>Head of Deduction</th>
              <th>Amount (Taka)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`salary-row-${index}`}>
                <td>{row.payment?.label ?? ""}</td>
                <td className="amount-cell">{row.payment?.amount ?? ""}</td>
                <td>{row.deduction?.label ?? ""}</td>
                <td className="amount-cell">{row.deduction?.amount ?? ""}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="summary-row">
              <td>Total Payment</td>
              <td className="amount-cell">{totalPayment}</td>
              <td>Total Deduction</td>
              <td className="amount-cell">{totalDeduction}</td>
            </tr>
            <tr className="summary-row net-row">
              <td colSpan={2}>Net Pay</td>
              <td colSpan={2} className="amount-cell">
                {netPay}
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="print-section salary-footer">
          <p>
            <strong>Total Tk. (In Words):</strong> Thirteen Thousand Three Hundred Twenty-Eight
            Only
          </p>
          <p className="salary-note">
            অনুগ্রহ করে মোট {netPay} টাকা আমার সোনালী ব্যাংক, জাতীয় বিশ্ববিদ্যালয় শাখা,
            গাজীপুর-১৭০৪ এর 0218801004162 নম্বর সেভিংস অ্যাকাউন্টে জমা দিন। কোনো ভুল বা
            অসঙ্গতি থাকলে অনতিবিলম্বে স্যালারি সেকশনকে জানান।
          </p>
        </div>

        <div className="signature-grid">
          <div>
            <div className="signature-line" />
            <p>LDA/UDA (Salary)</p>
          </div>
          <div>
            <div className="signature-line" />
            <p>Section Officer (Salary)</p>
          </div>
          <div>
            <div className="signature-line" />
            <p>Asst. Director (Salary)</p>
          </div>
          <div>
            <div className="signature-line" />
            <p>Deputy Director (Salary)</p>
          </div>
        </div>

        <div className="salary-acknowledge">
          <p>
            <strong>Name:</strong> Habibur Rahaman
          </p>
          <p>
            <strong>Designation:</strong> Administrative Officer
          </p>
          <p>
            <strong>Department:</strong> College Inspection
          </p>
          <p>
            <strong>Bank Account:</strong> 0218801004162
          </p>
          <p>
            <strong>PF No:</strong> 2125
          </p>
          <div className="signature-block">
            <div className="signature-line" />
            <p>Signature</p>
          </div>
        </div>
      </section>
    </div>
  );
}
