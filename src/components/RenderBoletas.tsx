import React, { useEffect, useState, memo } from "react";
import { Boleta } from "./Boleta";

interface Props {
  items: any[];
}

const RenderBoletasComponent = ({ items }: Props) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [renderedItems, setRenderedItems] = useState<any[]>([]);

  const intervaloBoleta = items.length > 20 ? 600 : 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < items.length) {
        const currentItem = items[currentIndex];
        setRenderedItems((prevItems) => [...prevItems, currentItem]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    }, intervaloBoleta); // Wait for 2 seconds between each item

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex, items]);

  useEffect(() => {
    setCurrentIndex(0);
    setRenderedItems([]);
  }, [items]);

  return (
    <div className="grid grid-cols-1 justify-center items-center ">
      {renderedItems.map((item, index) => (
        <Boleta key={index} item={item} index={index} />
      ))}
    </div>
  );
};

export const RenderBoletas = memo(RenderBoletasComponent);
