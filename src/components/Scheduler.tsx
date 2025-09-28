const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
const day = String(today.getDate()).padStart(2, "0");
const formattedDate = `${year}-${month}-${day}`;

export default function Scheduler() {
  const leads = [
    {
      name: "Shawn",
      instruments: ["lead", "acoustic", "drums", "bgv"],
    },
    {
      name: "Paula",
      instruments: ["lead", "acoustic", "keys", "bgv"],
    },
    {
      name: "Amanda",
      instruments: ["lead", "acoustic", "keys", "bgv"],
    },
    {
      name: "Jeongsoo",
      instruments: ["lead", "acoustic", "keys", "bgv"],
    },
    {
      name: "David Li",
      instruments: ["keys"],
    },
    {
      name: "Chris Bang",
      instruments: ["lead", "acoustic", "bgv"],
    },
    {
      name: "Austin",
      instruments: ["drums"],
    },
    {
      name: "Karino",
      instruments: ["violin"],
    },
    {
      name: "David Leong",
      instruments: ["electric", "bgv"],
    },
  ];

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = event.currentTarget;
    const data = new FormData(formData);
    console.log(data.get("date"));
    console.log(data.get("lead"));
    console.log(data.get("acoustic"));
    console.log(data.get("keys"));
    console.log(data.get("drums"));
    console.log(data.get("bgv"));
    console.log(data.get("drums"));
  };

  return (
    <>
      <form
        onSubmit={submitForm}
        className="flex flex-col gap-4 flex-1 mr-8 ml-8"
      >
        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="date">
            Date
          </label>
          <input
            className="p-2 rounded-md"
            id="date"
            name="date"
            type="date"
            min={formattedDate}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="lead">
            Lead
          </label>
          <select
            id="lead"
            name="lead"
            className="p-2 rounded-md appearance-none"
          >
            <option value="">Please Select</option>
            {leads.map((lead) => {
              if (lead.instruments.includes("lead")) {
                return <option key={lead.name}>{lead.name}</option>;
              }
            })}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="acoustic">
            Acoustic
          </label>
          <select
            id="acoustic"
            name="acoustic"
            className="p-2 rounded-md appearance-none"
          >
            <option value="">Please Select</option>
            {leads.map((lead) => {
              if (lead.instruments.includes("acoustic")) {
                return <option key={lead.name}>{lead.name}</option>;
              }
            })}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="keys">
            Keys
          </label>
          <select
            id="keys"
            name="keys"
            className="p-2 rounded-md appearance-none"
          >
            <option value="">Please Select</option>
            {leads.map((lead) => {
              if (lead.instruments.includes("keys")) {
                return <option key={lead.name}>{lead.name}</option>;
              }
            })}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="drums">
            Drums
          </label>
          <select
            id="drums"
            name="drums"
            className="p-2 rounded-md appearance-none"
          >
            <option value="">Please Select</option>
            {leads.map((lead) => {
              if (lead.instruments.includes("drums")) {
                return <option key={lead.name}>{lead.name}</option>;
              }
            })}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="electric">
            Electric
          </label>
          <select
            id="electric"
            name="electric"
            className="p-2 rounded-md appearance-none"
          >
            <option value="">Please Select</option>
            {leads.map((lead) => {
              if (lead.instruments.includes("electric")) {
                return <option key={lead.name}>{lead.name}</option>;
              }
            })}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="bgv">
            BGV
          </label>
          <select
            id="bgv"
            name="bgv"
            className="p-2 rounded-md appearance-none"
          >
            <option value="">Please Select</option>
            {leads.map((lead) => {
              if (lead.instruments.includes("bgv")) {
                return <option key={lead.name}>{lead.name}</option>;
              }
            })}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="violin">
            Violin
          </label>
          <select
            id="violin"
            name="violin"
            className="p-2 rounded-md appearance-none"
          >
            <option value="">Please Select</option>
            {leads.map((lead) => {
              if (lead.instruments.includes("violin")) {
                return <option key={lead.name}>{lead.name}</option>;
              }
            })}
          </select>
        </div>

        <button>Set Rotation</button>
      </form>
    </>
  );
}
