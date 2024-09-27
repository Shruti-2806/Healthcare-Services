import React, { useState, useEffect } from "react"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PlusIcon, Pencil, Trash2, Activity, Stethoscope } from "lucide-react";

function ServiceForm({
  onSubmit,
  initialData = { name: "", description: "", price: 0 },
  onCancel,
}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", description: "", price: "" };

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }
    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({ name: "", description: "", price: 0 });
      toast.success("Service saved successfully!");
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Service Name
        </label>
        <input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter service name"
          className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter service description"
          className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="price" className="text-sm font-medium">
          Price
        </label>
        <input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) =>
            setFormData({ ...formData, price: parseFloat(e.target.value) })
          }
          min="0"
          step="0.01"
          placeholder="Enter price"
          className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        />
        {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-300 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition duration-150"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="border border-gray-300 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition duration-150"
        >
          {initialData.name ? "Update Service" : "Add Service"}
        </button>
      </div>
    </form>
  );
}

export default function HealthcareServices() {
  const initialServices = [
    {
      id: 1,
      name: "General Checkup",
      description: "Full body checkup",
      price: 50,
    },
    {
      id: 2,
      name: "Blood Test",
      description: "Complete blood count test",
      price: 30,
    },
    {
      id: 3,
      name: "X-Ray",
      description: "X-ray imaging for diagnostics",
      price: 100,
    },
  ];

  const [services, setServices] = useState(() => {
    const savedServices = localStorage.getItem("services");
    return savedServices ? JSON.parse(savedServices) : initialServices;
  });

  const [editingService, setEditingService] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    console.log("Current services:", services);
    localStorage.setItem("services", JSON.stringify(services));
  }, [services]);

  const addService = (newService) => {
    const updatedServices = [...services, { ...newService, id: Date.now() }];
    setServices(updatedServices);
    setIsDialogOpen(false);
  };

  const updateService = (updatedService) => {
    setServices(
      services.map((service) =>
        service.id === updatedService.id ? updatedService : service
      )
    );
    setEditingService(null);
    setIsDialogOpen(false);
  };

  const deleteService = (id) => {
    setServices(services.filter((service) => service.id !== id));
    toast.info("Service deleted successfully!");
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl bg-gray-50 rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold flex items-center">
          <Stethoscope className="mr-2 h-6 w-6" />
          Healthcare Services Management
        </h1>
        <p className="mt-1">Efficiently manage your healthcare services</p>
      </div>

      {/* Services List Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Services List</h2>
        <button
          onClick={() => {
            setEditingService(null);
            setIsDialogOpen(true);
          }}
          className="border border-gray-300 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition duration-150"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add New Service
        </button>
      </div>

      {/* Service Form Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold">
              {editingService ? "Edit Service" : "Add New Service"}
            </h2>
            <ServiceForm
              onSubmit={editingService ? updateService : addService}
              initialData={
                editingService || { name: "", description: "", price: 0 }
              }
              onCancel={() => setIsDialogOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="border border-gray-300 p-4 flex flex-col bg-white rounded-lg shadow-sm hover:shadow-lg transition duration-150"
          >
            <div className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-semibold">{service.name}</h3>
              <Activity className="h-5 w-5 text-blue-500" />
            </div>
            <p className="mt-2 text-gray-700">{service.description}</p>
            <p className="mt-2 text-green-600 font-bold">${service.price}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  setEditingService(service);
                  setIsDialogOpen(true);
                }}
                className="text-blue-600 hover:underline"
              >
                <Pencil className="h-4 w-4 inline" /> Edit
              </button>
              <button
                onClick={() => deleteService(service.id)}
                className="text-red-600 hover:underline"
              >
                <Trash2 className="h-4 w-4 inline" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}
