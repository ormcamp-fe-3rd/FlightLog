interface TrackingToggleProps {
  isTracking: boolean;
  toggleTracking: () => void;
}

export default function TrackingToggle({
  isTracking,
  toggleTracking,
}: TrackingToggleProps) {
  return (
    <div className="form-control">
      <label className="label flex cursor-pointer gap-2">
        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={isTracking}
          onChange={toggleTracking}
        />
        <span className="label-text font-extrabold">Tracking Mode</span>
      </label>
    </div>
  );
}
