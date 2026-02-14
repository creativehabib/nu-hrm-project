import React from "react";

export default function EmployeeInfoA4({
  company = {
    name: "Your Company Ltd.",
    address: "House 00, Road 00, Dhaka-1200",
    phone: "+8801XXXXXXXXX",
    email: "hr@company.com",
    logoUrl: ""
  },
  employee = {
    id: "EMP-0001",
    name: "Habibur Rahaman",
    department: "HR",
    designation: "HR Officer",
    joiningDate: "2026-01-15",
    employmentType: "Full-time",
    status: "Active",
    phone: "+8801XXXXXXXXX",
    email: "habib@company.com",
    dob: "1990-01-01",
    nid: "1234567890",
    gender: "Male",
    bloodGroup: "O+",
    presentAddress: "Dhaka, Bangladesh",
    permanentAddress: "Dhaka, Bangladesh",
    homeDistrict: "Dhaka",
    bankName: "ABC Bank",
    bankAccount: "000000000000",
    bankBranch: "Dhaka",
    basicSalary: "35000"
  }
}) {
  const formatAsIsoDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toISOString().slice(0, 10);
  };

  const calculatePrlDate = (dob) => {
    if (!dob) {
      return null;
    }

    const parsedDob = new Date(dob);
    if (Number.isNaN(parsedDob.getTime())) {
      return null;
    }

    const prlDate = new Date(parsedDob);
    prlDate.setFullYear(prlDate.getFullYear() + 60);

    return prlDate;
  };

  const getRemainingServiceText = (prlDate) => {
    if (!prlDate) {
      return "-";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(prlDate);
    endDate.setHours(0, 0, 0, 0);

    const diffInMs = endDate.getTime() - today.getTime();

    if (diffInMs < 0) {
      return "আপনার চাকুরী কাল শেষ হয়েছে";
    }


    let years = prlDate.getFullYear() - today.getFullYear();
    let months = prlDate.getMonth() - today.getMonth();
    let days = prlDate.getDate() - today.getDate();

    if (days < 0) {
      const previousMonthLastDate = new Date(prlDate.getFullYear(), prlDate.getMonth(), 0).getDate();
      days += previousMonthLastDate;
      months -= 1;
    }

    if (months < 0) {
      months += 12;
      years -= 1;
    }

    const formatUnit = (value) => String(Math.max(value, 0)).padStart(2, "0");
    const duration = `${formatUnit(years)} বছর ${formatUnit(months)} মাস ${formatUnit(days)} দিন`;

    return `আপনার চাকুরী কাল আছে ${duration}`;
  };

  const calculatedPrlDate = calculatePrlDate(employee.dob);

  const infoRows = [
    { label: "Employee ID", value: employee.id },
    { label: "Full Name", value: employee.name },
    { label: "Department", value: employee.department },
    { label: "Designation", value: employee.designation },
    { label: "Joining Date", value: employee.joiningDate },
    { label: "Employment Type", value: employee.employmentType },
    { label: "Status", value: employee.status }
  ];

  const personalRows = [
    { label: "Phone", value: employee.phone },
    { label: "Email", value: employee.email },
    { label: "Date of Birth", value: employee.dob },
    { label: "NID", value: employee.nid },
    { label: "Gender", value: employee.gender },
    { label: "Blood Group", value: employee.bloodGroup },
    { label: "PRL Date", value: formatAsIsoDate(calculatedPrlDate) },
    { label: "Remaining Service", value: getRemainingServiceText(calculatedPrlDate) }
  ];

  const addressRows = [
    { label: "Present Address", value: employee.presentAddress },
    { label: "Permanent Address", value: employee.permanentAddress },
    { label: "Home District", value: employee.homeDistrict }
  ];

  const payrollRows = [
    { label: "Basic Salary", value: employee.basicSalary },
    { label: "Bank Name", value: employee.bankName },
    { label: "Account No.", value: employee.bankAccount },
    { label: "Branch", value: employee.bankBranch }
  ];

  const Section = ({ title, rows }) => (
    <div className="section">
      <div className="sectionTitle">{title}</div>
      <table className="table">
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td className="tdLabel">{row.label}</td>
              <td className="tdValue">{row.value || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="a4 print-area">
      <header className="header">
        <div className="headerLeft">
          {company.logoUrl ? (
            <img className="logo" src={company.logoUrl} alt="logo" />
          ) : (
            <div className="logoPlaceholder">LOGO</div>
          )}
        </div>

        <div className="headerCenter">
          <div className="companyName">{company.name}</div>
          <div className="companyMeta">
            {company.address} • {company.phone} • {company.email}
          </div>
          <div className="docTitle">EMPLOYEE INFORMATION SHEET</div>
        </div>

        <div className="headerRight">
          <div className="metaBox">
            <div className="metaRow">
              <span>Doc No:</span> <b>HR-EMP-INFO</b>
            </div>
            <div className="metaRow">
              <span>Issue:</span>{" "}
              <b>{new Date().toISOString().slice(0, 10)}</b>
            </div>
          </div>
        </div>
      </header>

      <main className="pt">
        <div className="grid2">
          <Section title="Job Information" rows={infoRows} />
          <Section title="Personal Information" rows={personalRows} />
        </div>

        <div className="grid2">
          <Section title="Address" rows={addressRows} />
          <Section title="Payroll / Bank" rows={payrollRows} />
        </div>

        <div className="signRow">
          <div className="signBox">
            <div className="signLine" />
            <div className="signLabel">Employee Signature</div>
          </div>
          <div className="signBox">
            <div className="signLine" />
            <div className="signLabel">HR / Authorized Signature</div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div>Confidential • For internal use only</div>
        <div className="pageHint">A4 • Print optimized</div>
      </footer>

      <style>{`
        .a4{
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          background: #fff;
          box-sizing: border-box;
          padding: 12mm;
          font-family: Arial, Helvetica, sans-serif;
          color: #111;
          position: relative;
        }

        .header{
          display:flex;
          gap: 10mm;
          align-items:center;
          padding-bottom: 6mm;
          border-bottom: 1px solid #ddd;
        }
        .headerLeft{ width: 28mm; }
        .logo{ width: 28mm; height: 28mm; object-fit: contain; }
        .logoPlaceholder{
          width: 28mm; height: 28mm;
          border: 1px dashed #bbb;
          display:flex; align-items:center; justify-content:center;
          font-size: 12px; color:#666;
        }

        .headerCenter{ flex: 1; text-align:center; }
        .companyName{ font-size: 18px; font-weight: 700; }
        .companyMeta{ margin-top: 2mm; font-size: 11px; color:#444; }
        .docTitle{
          margin-top: 4mm;
          display:inline-block;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .6px;
          padding: 2mm 4mm;
          border: 1px solid #111;
        }

        .headerRight{ width: 45mm; }
        .metaBox{
          border: 1px solid #ddd;
          padding: 3mm;
          font-size: 11px;
        }
        .metaRow{ display:flex; justify-content:space-between; gap: 4mm; }
        .metaRow span{ color:#444; }

        .pt{ padding-top: 8mm; }

        .grid2{
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap: 8mm;
          margin-bottom: 8mm;
        }

        .sectionTitle{
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 3mm;
          padding-bottom: 2mm;
          border-bottom: 1px solid #eee;
        }

        .table{
          width: 100%;
          border-collapse: collapse;
          font-size: 11.5px;
        }
        .table tr{
          border: 1px solid #e5e5e5;
        }
        .table td{
          padding: 2.8mm 3mm;
          vertical-align: top;
        }
        .tdLabel{
          width: 38%;
          font-weight: 700;
          background: #fafafa;
          border-right: 1px solid #e5e5e5;
        }
        .tdValue{ width: 62%; }

        .signRow{
          display:flex;
          gap: 10mm;
          justify-content: space-between;
          margin-top: 12mm;
        }
        .signBox{ width: 50%; }
        .signLine{
          border-bottom: 1px solid #111;
          height: 10mm;
        }
        .signLabel{
          margin-top: 2mm;
          font-size: 11px;
          color:#333;
        }

        .footer{
          position: absolute;
          left: 12mm;
          right: 12mm;
          bottom: 10mm;
          display:flex;
          justify-content: space-between;
          font-size: 10.5px;
          color:#555;
          border-top: 1px solid #ddd;
          padding-top: 3mm;
        }

        @page { size: A4; margin: 0; }
        @media print {
          body { margin: 0; }
          .a4 { box-shadow: none; }
          button { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }

        @media screen and (max-width: 900px){
          .a4{ width: 100%; min-height: auto; padding: 16px; }
          .grid2{ grid-template-columns: 1fr; }
          .footer{ position: static; margin-top: 16px; }
        }
      `}</style>
    </div>
  );
}
