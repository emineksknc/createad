import * as S from './upload.ts'
import React, { useState, Text } from 'react'

import { BsUpload } from 'react-icons/bs'
import { ImSpinner2 } from 'react-icons/im'
import Logo from '../assets/logo.png'
//import { setTimeout } from 'timers'



function ImageForm() {
  const [image, setImage] = useState('');
  const [prompt, setPrompt] = useState('');
  const [color, setColor] = useState('');
  const [resultImage, setResultImage] = useState('');

  const [file, setFile] = useState('');
  const [imagePreview, setImagePreview] = useState('')
  const [base64, setBase64] = useState('')
  const [name, setName] = useState('')
  const [size, setSize] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onChange = (e: any) => {
    console.log('file', e.target.files[0])
    let file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = _handleReaderLoaded
      reader.readAsBinaryString(file)
    }
  }

  const _handleReaderLoaded = (readerEvt: any) => {
    let binaryString = readerEvt.target.result
    setBase64(btoa(binaryString))
  }

  const onFileSubmit = (e: any) => {
    setIsLoading(true)
    e.preventDefault()
    console.log('bine', base64)
    let payload = { image: base64 }
    console.log('payload', payload)

    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const photoUpload = (e: any) => {
    e.preventDefault()
    const reader = new FileReader()
    const file = e.target.files[0]
    console.log('reader', reader)
    console.log('file', file)
    if (reader !== undefined && file !== undefined) {
      reader.onloadend = () => {
        setFile(file)
        setSize(file.size)
        setName(file.name)
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const remove = () => {
    setFile('')
    setImagePreview('')
    setBase64('')
    setName('')
    setSize('')
  }


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', image);
    formData.append('prompt', prompt);
    formData.append('color', color);

    try {
      const response = await fetch('http://127.0.0.1:8000/generate', {
        method: 'POST',
        body: formData,
        mode: "no-cors",
      });

      if (response.ok) {
        const result = await response.blob(); // Gelen görüntüyü al
        setResultImage(URL.createObjectURL(result));
      } else {
        console.error('Sunucu yanıt hatası:', response.statusText);
      }
    } catch (error) {
      console.error('Hata:', error);
    }
  };
 return (
    <S.Container>
      <form onSubmit={(e) => onFileSubmit(e)} onChange={(e) => onChange(e)}>
        <S.Card
          logo={Logo}
          width={imagePreview === '' ? 310 : 310}
          height={imagePreview === '' ? 400 : 480}
          style={{ marginRight: 200 }}

        >
          <S.Perfil
            top={imagePreview === '' ? 0 : -10}
            width={imagePreview === '' ? 120 : 200}
            height={imagePreview === '' ? 120 : 200}

          >
            {imagePreview === '' ? (
              <>

              <input
              type='file'
              name='avatar'
              id='file'
              accept='.png'
              onChange={photoUpload}
              src={imagePreview}
                />
                <BsUpload />



            </>
            ) : (

              <img src={imagePreview} alt='Icone adicionar' />

            )}


          </S.Perfil>


          {imagePreview !== '' && (
            <>

          <label>
          <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} autoComplete="on" required />
          </label>


          <label>
          <input type="text" value={color} onChange={(e) => setColor(e.target.value)} autoComplete="on" required/>
          </label>
              <button type='submit'>
                {isLoading ? (
                  <S.Spinner>
                    <ImSpinner2 />
                  </S.Spinner>
                ) : (
                  <>Create</>
                )}
              </button>
              <button type='button' onClick={remove}>
                Remove
              </button>
            </>
          )}
        </S.Card>
      </form>

      <S.Card
          logo={Logo}
          width={imagePreview === '' ? 310 : 310}
          height={imagePreview === '' ? 400 : 480}


        >


        </S.Card>
    </S.Container>
  )
}

export default ImageForm;
