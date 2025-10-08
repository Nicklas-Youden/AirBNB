import { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Icon from "../../lib/icon/icon";

interface HostFormData {
  title: string;
  roomType: string;
  description: string;
  address: string;
  city: string;
  country: string;
  price: number;
  images: string[];
  amenities: string[];
  maxGuests: number;
  bedRooms: number;
  bathRooms: number;
  beds: number;
  available: {
    from: string;
    to: string;
  };
}

const Host = () => {
  const [formData, setFormData] = useState<HostFormData>({
    title: "",
    roomType: "",
    description: "",
    address: "",
    city: "",
    country: "",
    price: 0,
    images: [],
    amenities: [],
    maxGuests: 0,
    bedRooms: 0,
    bathRooms: 0,
    beds: 0,
    available: {
      from: "",
      to: "",
    },
  });
  const [newAmenity, setNewAmenity] = useState("");

  const roomTypes = [
    "House",
    "Apartment",
    "Condo",
    "Bungalow",
    "Cabin",
    "Boat",
    "Castle",
    "Chalet",
    "Cottage",
    "Guesthouse / Guest suite",
    "Hotel / Boutique hotel",
    "Loft",
    "Mobile-home / RV / Camper",
    "Tent",
    "Treehouse",
    "Yurt",
    "Tiny home",
    "Riad; Ryokan",
    "Casa Particular",
    "Desert home",
    "Dome",
    "Earth home",
    "Containers",
    "Caves",
  ];

  const commonAmenities = [
    "WiFi",
    "Kitchen",
    "Washer",
    "Dryer",
    "Air conditioning",
    "Heating",
    "Dedicated workspace",
    "TV",
    "Hair dryer",
    "Iron",
    "Pool",
    "Hot tub",
    "Free parking",
    "Gym",
    "Breakfast",
    "Smoking allowed",
    "Pets allowed",
  ];

  const handleInputChange = (
    field: keyof HostFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvailabilityChange = (field: "from" | "to", value: string) => {
    setFormData((prev) => ({
      ...prev,
      available: {
        ...prev.available,
        [field]: value,
      },
    }));
  };

  const addAmenity = (amenity: string) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenity],
      }));
    }
    setNewAmenity("");
  };

  const removeAmenity = (amenityToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter(
        (amenity) => amenity !== amenityToRemove
      ),
    }));
  };

  const onDrop = (acceptedFiles: File[]) => {
    // Convert files to data URLs for preview
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, dataUrl],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
  });

  const removeImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Host BnB Form Data:", formData);
    // TODO: Send to API
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Typography
        variant="h3"
        component="h1"
        className="text-center mb-4 font-bold"
      >
        List Your Property
      </Typography>

      <form onSubmit={handleSubmit} id="host-form">
        <div className="space-y-8">
          <div>
            <Typography variant="h6" className="mb-4 font-semibold">
              Basic Information
            </Typography>
            <div className="space-y-4">
              <TextField
                className="
             [&_.MuiOutlinedInput-root_.MuiOutlinedInput-notchedOutline]:border-purple-300
             [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-purple-500
             [&_.MuiInputLabel-root]:text-purple-500
             [&_.MuiInputLabel-root.Mui-focused]:text-purple-500"
                fullWidth
                label="Property Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormControl
                  fullWidth
                  required
                  className="[&_.MuiOutlinedInput-root_.MuiOutlinedInput-notchedOutline]:border-purple-300 [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-purple-500 [&_.MuiInputLabel-root]:text-purple-500 [&_.MuiInputLabel-root.Mui-focused]:text-purple-500"
                >
                  <InputLabel>Room Type</InputLabel>
                  <Select
                    value={formData.roomType}
                    onChange={(e) =>
                      handleInputChange("roomType", e.target.value)
                    }
                    label="Room Type"
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                        },
                      },
                    }}
                  >
                    {roomTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  className="
             [&_.MuiOutlinedInput-root_.MuiOutlinedInput-notchedOutline]:border-purple-300
             [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-purple-500
             [&_.MuiInputLabel-root]:text-purple-500
             [&_.MuiInputLabel-root.Mui-focused]:text-purple-500"
                  fullWidth
                  label="Price full stay"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange("price", Number(e.target.value))
                  }
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    },
                    htmlInput: {
                      min: 0,
                    },
                  }}
                />
              </div>

              <TextField
                className="
             [&_.MuiOutlinedInput-root_.MuiOutlinedInput-notchedOutline]:border-purple-300
             [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-purple-500
             [&_.MuiInputLabel-root]:text-purple-500
             [&_.MuiInputLabel-root.Mui-focused]:text-purple-500"
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div>
            <Typography variant="h6" className="mb-4 font-semibold">
              Location
            </Typography>
            <div className="space-y-4">
              <TextField
                className="
             [&_.MuiOutlinedInput-root_.MuiOutlinedInput-notchedOutline]:border-purple-300
             [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-purple-500
             [&_.MuiInputLabel-root]:text-purple-500
             [&_.MuiInputLabel-root.Mui-focused]:text-purple-500"
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  className="
             [&_.MuiOutlinedInput-root_.MuiOutlinedInput-notchedOutline]:border-purple-300
             [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-purple-500
             [&_.MuiInputLabel-root]:text-purple-500
             [&_.MuiInputLabel-root.Mui-focused]:text-purple-500"
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                />
                <TextField
                  className="
             [&_.MuiOutlinedInput-root_.MuiOutlinedInput-notchedOutline]:border-purple-300
             [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-purple-500
             [&_.MuiInputLabel-root]:text-purple-500
             [&_.MuiInputLabel-root.Mui-focused]:text-purple-500"
                  fullWidth
                  label="Country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Typography variant="h6" className="mb-4 font-semibold">
              Property Details
            </Typography>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <TextField
                className="
             [&_.MuiOutlinedInput-root_.MuiOutlinedInput-notchedOutline]:border-purple-300
             [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-purple-500
             [&_.MuiInputLabel-root]:text-purple-500
             [&_.MuiInputLabel-root.Mui-focused]:text-purple-500"
                fullWidth
                label="Max Guests"
                type="number"
                value={formData.maxGuests}
                onChange={(e) =>
                  handleInputChange("maxGuests", Number(e.target.value))
                }
                required
                slotProps={{
                  htmlInput: {
                    min: 0,
                  },
                }}
              />
              <TextField
                className="
             [&_.MuiOutlinedInput-root_.MuiOutlinedInput-notchedOutline]:border-purple-300
             [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-purple-500
             [&_.MuiInputLabel-root]:text-purple-500
             [&_.MuiInputLabel-root.Mui-focused]:text-purple-500"
                fullWidth
                label="Bedrooms"
                type="number"
                value={formData.bedRooms}
                onChange={(e) =>
                  handleInputChange("bedRooms", Number(e.target.value))
                }
                required
                slotProps={{
                  htmlInput: {
                    min: 0,
                  },
                }}
              />
              <TextField
                className="
             [&_.MuiOutlinedInput-root_.MuiOutlinedInput-notchedOutline]:border-purple-300
             [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-purple-500
             [&_.MuiInputLabel-root]:text-purple-500
             [&_.MuiInputLabel-root.Mui-focused]:text-purple-500"
                fullWidth
                label="Bathrooms"
                type="number"
                value={formData.bathRooms}
                onChange={(e) =>
                  handleInputChange("bathRooms", Number(e.target.value))
                }
                required
                slotProps={{
                  htmlInput: {
                    min: 0,
                  },
                }}
              />
              <TextField
                className="
             [&_.MuiOutlinedInput-root_.MuiOutlinedInput-notchedOutline]:border-purple-300
             [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-purple-500
             [&_.MuiInputLabel-root]:text-purple-500
             [&_.MuiInputLabel-root.Mui-focused]:text-purple-500"
                fullWidth
                label="Beds"
                type="number"
                value={formData.beds}
                onChange={(e) =>
                  handleInputChange("beds", Number(e.target.value))
                }
                required
                slotProps={{
                  htmlInput: {
                    min: 0,
                  },
                }}
              />
            </div>
          </div>

          <div>
            <Typography variant="h6" className="mb-4 font-semibold">
              Availability
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                className="
             [&_.MuiOutlinedInput-root_.MuiOutlinedInput-notchedOutline]:border-purple-300
             [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-purple-500
             [&_.MuiInputLabel-root]:text-purple-500
             [&_.MuiInputLabel-root.Mui-focused]:text-purple-500"
                fullWidth
                label="Available From"
                type="date"
                value={formData.available.from}
                onChange={(e) =>
                  handleAvailabilityChange("from", e.target.value)
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
              <TextField
                className="
             [&_.MuiOutlinedInput-root_.MuiOutlinedInput-notchedOutline]:border-purple-300
             [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-purple-500
             [&_.MuiInputLabel-root]:text-purple-500
             [&_.MuiInputLabel-root.Mui-focused]:text-purple-500"
                fullWidth
                label="Available To"
                type="date"
                value={formData.available.to}
                onChange={(e) => handleAvailabilityChange("to", e.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </div>
          </div>

          <div>
            <Typography variant="h6" className="mb-4 font-semibold">
              Images
            </Typography>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-purple-400 bg-purple-50"
                  : "border-purple-300 hover:border-purple-400"
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <div>
                  <Typography variant="body1" className="text-purple-600 mb-2">
                    Drop the images here...
                  </Typography>
                  <Typography variant="body2" className="text-purple-400">
                    Supports: .jpeg, .jpg, .png, .webp
                  </Typography>
                </div>
              ) : (
                <div>
                  <Typography variant="body1" className="mb-2">
                    Drag & drop images here, or click to select files
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    Supports: .jpeg, .jpg, .png, .webp
                  </Typography>
                </div>
              )}
            </div>

            {formData.images.length > 0 && (
              <div className="mt-6">
                <Typography variant="subtitle1" className="mb-3 font-medium">
                  Uploaded Images ({formData.images.length})
                </Typography>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-400 shadow-md"
                      />
                      <IconButton
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 min-w-0 w-6 h-6 p-0 bg-red-700 text-white hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        size="small"
                      >
                        <Icon
                          type="close"
                          size="small"
                          className="w-4 h-4 fill-white"
                        />
                      </IconButton>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <Typography variant="h6" className="mb-4 font-semibold">
              Amenities
            </Typography>
            <div className="flex gap-2 mb-4">
              <TextField
                placeholder="Custom amenity"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                className="flex-1
             [&_.MuiOutlinedInput-root_.MuiOutlinedInput-notchedOutline]:border-purple-300
             [&_.MuiOutlinedInput-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-purple-500
             [&_.MuiInputLabel-root]:text-purple-500
             [&_.MuiInputLabel-root.Mui-focused]:text-purple-500"
              />
              <Button
                onClick={() => addAmenity(newAmenity)}
                variant="outlined"
                className="border-purple-300 text-purple-500 hover:bg-purple-50"
              >
                Add
              </Button>
            </div>
            <Box className="mb-4">
              <Typography variant="subtitle2" className="mb-2">
                Common Amenities:
              </Typography>
              <Box className="flex flex-wrap gap-1">
                {commonAmenities.map((amenity) => (
                  <Button
                    key={amenity}
                    size="small"
                    variant={
                      formData.amenities.includes(amenity)
                        ? "contained"
                        : "outlined"
                    }
                    className={
                      formData.amenities.includes(amenity)
                        ? "bg-purple-500 hover:bg-purple-600"
                        : "border-purple-300 text-purple-500 hover:bg-purple-50"
                    }
                    onClick={() => {
                      if (formData.amenities.includes(amenity)) {
                        removeAmenity(amenity);
                      } else {
                        addAmenity(amenity);
                      }
                    }}
                  >
                    {amenity}
                  </Button>
                ))}
              </Box>
            </Box>
            <Box className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, index) => (
                <Chip
                  key={index}
                  label={amenity}
                  onClick={() => removeAmenity(amenity)}
                  onDelete={() => removeAmenity(amenity)}
                  className="bg-purple-500 text-white cursor-pointer transition-all duration-200 hover:bg-purple-600  shadow-md [&_.MuiChip-deleteIcon]:text-white [&_.MuiChip-deleteIcon]:hover:text-gray-200 [&_.MuiChip-deleteIcon]:transition-colors"
                />
              ))}
            </Box>
          </div>

          <div className="">
            <Button
              type="submit"
              variant="contained"
              size="large"
              className="bg-gradient-to-b from-purple-700 to-purple-800 px-12 py-3 rounded-lg text-white hover:opacity-90"
            >
              List Property
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Host;
