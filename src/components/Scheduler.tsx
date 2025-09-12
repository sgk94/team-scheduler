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

  return (
    <>
      <form className="flex flex-col gap-4 w-auto">
        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="lead">
            Lead
          </label>
          <select id="lead" name="lead">
            {leads.map((lead) => {
              if (lead.instruments.includes("lead")) {
                return <option>{lead.name}</option>;
              }
            })}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="acoustic">
            Acoustic
          </label>
          <select id="acoustic" name="acoustic">
            {leads.map((lead) => {
              if (lead.instruments.includes("acoustic")) {
                return <option>{lead.name}</option>;
              }
            })}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="keys">
            Keys
          </label>
          <select id="keys" name="keys">
            {leads.map((lead) => {
              if (lead.instruments.includes("keys")) {
                return <option>{lead.name}</option>;
              }
            })}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="drums">
            Drums
          </label>
          <select id="drums" name="drums">
            {leads.map((lead) => {
              if (lead.instruments.includes("drums")) {
                return <option>{lead.name}</option>;
              }
            })}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="electric">
            Electric
          </label>
          <select id="electric" name="electric">
            {leads.map((lead) => {
              if (lead.instruments.includes("electric")) {
                return <option>{lead.name}</option>;
              }
            })}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="bgv">
            BGV
          </label>
          <select id="bgv" name="bgv">
            {leads.map((lead) => {
              if (lead.instruments.includes("bgv")) {
                return <option>{lead.name}</option>;
              }
            })}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold" htmlFor="violin">
            Violin
          </label>
          <select id="violin" name="violin">
            {leads.map((lead) => {
              if (lead.instruments.includes("violin")) {
                return <option>{lead.name}</option>;
              }
            })}
          </select>
        </div>
      </form>

      <div>
        <span>Rotation Window</span>
        <span>Sunday September 14</span>
      </div>
    </>
  );
}
