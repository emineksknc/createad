//import React, { useState } from "react";
//

//function Home() {
//  const [selectedImage, setSelectedImage] = useState(null);
//  const refreshPage = () => {
//    window.location.reload();
//    setSelectedImage(null)
//
//  }
//
//
//  return (
//    <div>
//      <h1>Upload and Display Image usign React Hook's</h1>
//
//      {selectedImage && (
//        <div>
//          <img
//            alt="not found"
//            width={"250px"}
//            src={URL.createObjectURL(selectedImage)}
//          />
//          <br />
//          <button onClick={refreshPage}>Remove</button>
//        </div>
//      )}
//
//      <br />
//      <br />
//
//      <input
//        type="file"
//        name="myImage"
//        onChange={(event) => {
//          console.log(event.target.files[0]);
//          setSelectedImage(event.target.files[0]);
//        }}
//        title='Choose'
//      />
//    </div>
//  );
//};
//
//export default Home;


import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    useDisclosure
} from "@chakra-ui/react";

const ImageContext = React.createContext({
  todos: [], fetchImage: () => {}
})

export default function Home() {
  const [image, setImage] = useState([])
  const fetchImage = async () => {
    const response = await fetch("http://localhost:8000/generate")
    const image = await response.json()
    setImage(image.data)

  }
  useEffect(() => {
    fetchImage()
  }, [])
  return (
    <ImageContext.Provider value={{image, fetchImage}}>
      <AddImage />  {/* new */}
      <Stack spacing={5}>
        {image.map((image) => (
          <b>{image.item}</b>
        ))}
      </Stack>
    </ImageContext.Provider>
  )
}

let imageResponse = await fetch(imgBase64);


function AddImage() {
  const [item, setItem] = React.useState("")
  const {image, fetchImage} = React.useContext(ImageContext)

  const handleInput = event  => {
    setItem(event.target.value)
  }

  const handleSubmit = (event) => {
    const newImage = {
      "id": image.length + 1,
      "item": item
    }

    fetch("http://localhost:8000/generate", {
      method: "POST",
        headers: {
        'Content-Type': 'image/png',
        'Content-Transfer-Encoding': 'base64'
    },
    body: imageResponse.blob()
    }).then(fetchImage)
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type="file"
          placeholder="Add a Image"
          aria-label="Add a todo item"
          onChange={handleInput}
        />
      </InputGroup>
    </form>
  )
}