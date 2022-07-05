import PropTypes from "prop-types";
import { For } from "../../utils";

const Dropdown = ({ dataDropdown, onClick }) => (
  <div className="group relative">
    <button className="bg-slate-700 px-4 py-1.5 rounded">Select Anime</button>
    <nav className="border-2 bg-slate-700 invisible border-slate-800 rounded w-60 absolute -right-[105px] sm:-left-[105px] top-14 transition-all opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-1 z-[999]">
      <ul className="py-1">
        <For
          each={dataDropdown}
          render={(data, index) => (
            <li key={index}>
              <button
                data-value={`${data.path}`}
                className="w-full text-left block px-4 py-1.5 transition-all duration-200 hover:bg-slate-800"
                onClick={onClick}
              >
                {data.name}
              </button>
            </li>
          )}
        />
      </ul>
    </nav>
  </div>
);

Dropdown.propTypes = {
  dataDropdown: PropTypes.array.isRequired,
  onClick: PropTypes.func,
};

export default Dropdown;
