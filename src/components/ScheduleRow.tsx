type ScheduleRowProps = {
  date: string;
  instrument: string;
  notes: string;
};

export default function ScheduleRow({
  date,
  instrument,
  notes,
}: ScheduleRowProps) {
  return (
    <tr className="shadow-md">
      <td className="px-3 py-2 bg-blue-900 rounded-l-md">
        <span className="text-neutral-100">{date}</span>
      </td>
      <td className="px-3 py-2 bg-blue-900">
        <span className="text-neutral-100">{instrument}</span>
      </td>
      <td className="px-3 py-2 bg-blue-900 rounded-r-md">
        <span className="text-neutral-100">{notes}</span>
      </td>
    </tr>
  );
}
