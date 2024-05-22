import { useEffect, useState, memo } from "react";
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
    <>
      {renderedItems.map((item, index) => (
        <Boleta key={index} item={item} />
      ))}
    </>
  );
};

export const RenderBoletas = memo(RenderBoletasComponent);
