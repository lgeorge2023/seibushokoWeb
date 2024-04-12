import { Box, FileInput, Image, Modal } from "@mantine/core";
import { IconTrash, IconUpload } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";

const ImageFile = (props) => {
  const { name, form, label } = props;
  const [page, setPage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const viewImage = () => {
    setShowModal(true);
  };
  useEffect(() => {
    if (name == "product_image" || name == "specimage") {
      setPage("prdt/machn");
    }
  }, [name]);

  const deleteImage = () => {
    if (page !== null) {
      form.setValues({ delete_image: 1 });
      form.setFieldValue(name, "");
    } else {
      const currentDeleteImages = form.values["delete_image"] || [];
      currentDeleteImages.push(name);
      form.setValues({ delete_image: currentDeleteImages });
      form.setFieldValue(name, "");
    }
  };
  const removeImageFromDeleteArray = () => {
    const currentDeleteImages = form.values["delete_image"] || [];
    const updatedDeleteImages = currentDeleteImages.filter(
      (imageName) => imageName !== name
    );
    form.setValues({ delete_image: updatedDeleteImages });
  };
  const handleChange = (value) => {
    if (page !== null) {
      // Case when page is not null
      form.setValues({ delete_image: 0 });
      form.setFieldValue(name, value);
    } else {
      // Case when page is null
      removeImageFromDeleteArray();
      form.setFieldValue(name, value);
    }
  };
  const imageUrl =
    form.values[name] != null && typeof form.values[name] == "object"
      ? URL.createObjectURL(form.values[name])
      : form.values[name];
  return (
    <Box>
      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        size="xl"
        title="Image"
      >
        <Image width={700} height={600} alt="Image Preview" src={imageUrl} />
      </Modal>
      <FileInput
        key={name}
        label={label}
        accept=".pdf,.jpg,.png,.jpeg"
        clearable={typeof form.values[name]=="object"}
        icon={<IconUpload size="0.4cm" />}
        value={typeof form.values[name] == "object" ? form.values[name] : ""}
        onChange={handleChange}
        {...props}
      />
      {imageUrl && (
        <>
          {typeof form.values[name] != "object" && (
            <IconTrash
              style={{ marginLeft: 80 }}
              cursor={"pointer"}
              size="20"
              color="red"
              onClick={deleteImage}
            />
          )}
          <Image
            style={{ cursor: "pointer" }}
            width={100}
            height={80}
            alt="Image Preview"
            src={imageUrl}
            onClick={viewImage}
          />
        </>
      )}
    </Box>
  );
};

export default ImageFile;
