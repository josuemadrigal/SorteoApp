import React, { useEffect, useState, memo } from "react";
import { Boleta } from "./Boleta";

interface Props {
  items: any[];
}

const RenderBoletasComponent = ({ items }: Props) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [renderedItems, setRenderedItems] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < items.length) {
        const currentItem = items[currentIndex];
        setRenderedItems((prevItems) => [...prevItems, currentItem]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    }, 2000); // Wait for 2 seconds between each item

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex, items]);

  useEffect(() => {
    setCurrentIndex(0);
    setRenderedItems([]);
  }, [items]);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5  ">
      {renderedItems.map((item, index) => (
        <Boleta key={index} item={item} index={index} />
      ))}
    </div>
  );
};

export const RenderBoletas = memo(RenderBoletasComponent);
