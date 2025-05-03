import React from "react";
import { useForm } from "react-hook-form";

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        {...register("Nombre", { required: true, maxLength: 80 })}
      />
      <input
        type="password"
        placeholder="Cedula"
        {...register("Cedula", {
          required: true,
          maxLength: 100,
          pattern: /xxxxxxxxxx/i,
        })}
      />
      <input
        type="email"
        placeholder="Correo Electronico"
        {...register("Correo Electronico", {
          required: true,
          pattern: /^\S+@\S+$/i,
        })}
      />
      <input
        type="tel"
        placeholder="Télefono"
        {...register("Télefono", { required: true, maxLength: 12 })}
      />
      <select {...register("Municipio", { required: true })}>
        <option value="La Romana">La Romana</option>
        <option value="Villa Hermosa">Villa Hermosa</option>
        <option value="Caleta">Caleta</option>
        <option value="Guaymate">Guaymate</option>
      </select>

      <input type="submit" />
    </form>
  );
}
