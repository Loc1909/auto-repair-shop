import { C } from "../../constants/colors";

export default function FilterTabs({ filter, setFilter, filters }) {
  return (
    <div
      style={{
        display: "flex",
        gap: ".4rem",
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        borderRadius: 50,
        padding: ".3rem",
        flexWrap: "wrap",
        justifyContent: "flex-end",
      }}
    >
      {filters.map(([value, label]) => (
        <button
          key={value}
          className={`tab-btn${filter === value ? " active" : ""}`}
          onClick={() => setFilter(value)}
          style={{
            fontSize: ".7rem",
            padding: ".25rem .5rem",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}