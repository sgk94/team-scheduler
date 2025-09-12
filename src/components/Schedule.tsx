import ScheduleRow from "./ScheduleRow";
import { Link } from "react-router-dom";

export default function Schedule() {
  return (
    <>
      <div className="flex flex-row place-content-between">
        <h1 className="text-neutral-700">Hey Shawn you're serving</h1>
        <Link
          to="/rotations"
          className="rounded-md px-4 py-1 bg-blue-700 text-neutral-100"
        >
          Schedule Now
        </Link>
      </div>
      <table className="w-full border-separate border-spacing-y-2">
        <thead className="text-left">
          <tr>
            <th className="px-3 py-2 text-sm font-semibold text-neutral-700">
              Date
            </th>
            <th className="px-3 py-2 text-sm font-semibold text-neutral-700">
              Instrument
            </th>
            <th className="px-3 py-2 text-sm font-semibold text-neutral-700">
              Notes
            </th>
          </tr>
        </thead>
        <tbody>
          <ScheduleRow date={"5/5/25"} instrument={"drums"} notes={"efooo"} />
          <ScheduleRow date={"5/5/25"} instrument={"drums"} notes={"efooo"} />
          <ScheduleRow date={"5/5/25"} instrument={"drums"} notes={"efooo"} />
        </tbody>
      </table>
    </>
  );
}
