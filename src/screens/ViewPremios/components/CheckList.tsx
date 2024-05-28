import React from "react";

interface CheckListProps {
  checkList: { nombre: string }[];
  checkedItems: Set<string>;
  handleCheck: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isChecked: (nombre: string) => boolean;
}

const CheckList: React.FC<CheckListProps> = ({
  checkList,
  checkedItems,
  handleCheck,
  isChecked,
}) => {
  return (
    <div className="checkList">
      <div className="title">Listado De Boletas:</div>
      <div className="list-container">
        {checkList.map((item) => (
          <div key={item.nombre}>
            <input
              value={item.nombre}
              type="checkbox"
              onChange={handleCheck}
              checked={isChecked(item.nombre)}
            />
            <span className={isChecked(item.nombre) ? "checked" : ""}>
              {item.nombre}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckList;
