import React, { useState, Text, useRef} from 'react'
import * as S from './upload.ts'

import { BsUpload } from 'react-icons/bs'
import { ImSpinner2 } from 'react-icons/im'
import Logo from '../assets/logo.png'
//import { setTimeout} from 'timers'


// import PQueue from 'p-queue';
// const sıra = 0
// const queue = await new PQueue({ concurrency: 1 }); // Aynı anda sadece bir işlem çalışsın
// function addToQueue(url) {
//   queue.add(() => fetch(url).then((response) => response.json()));
//   console.log('Kuyruğa eklendin.. Sıra: ', sıra+1)
// }


function CardToImage({ logo, width, height }) {
  const canvasRef = useRef(null);

  const convertCardToImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Kartın içeriğini canvas üzerine çizin
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff'; // Kart arka plan rengi
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Logo veya diğer içerikleri çizmek için gerekli kodları buraya ekleyin

    // Canvas üzerindeki resmi bir görüntüye dönüştürün
    const cardImage = new Image();
    cardImage.src = canvas.toDataURL();

    // Görüntüyü kaydedebilir veya görüntülemek için kullanabilirsiniz
    // Örneğin:
    const imgLink = document.createElement('a');
    imgLink.href = cardImage.src;
    imgLink.download = 'card.png';
    imgLink.click();
  };
}

const ColoredLine = ({ color}) => (
  <hr
      style={{
          color: color,
          backgroundColor: color,
          height: 10,
          width: '100%',
          margin:50
         
      }}
  />
);
export default function Upload() {
  const [file, setFile] = useState('');
  const [imagePreview, setImagePreview] = useState('')
  const [base64, setBase64] = useState('')
  const [name, setName] = useState('')
  const [size, setSize] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [prompt, setPrompt] = useState('');
  const [color, setColor] = useState('');
  const [resultImage, setResultImage] = useState('');
  const [punchlineText, setPunchlineText] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [logoPreview, setLogoPreview] = useState('')

  const onChange = async (e: any) => {
    if (e.target && e.target.files && e.target.files[0]) {
      console.log('file', e.target.files[0])
      let file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = _handleReaderLoaded
        reader.readAsBinaryString(file)
      
      }
    }
  }

  const _handleReaderLoaded = async (readerEvt: any) => {
    let binaryString = readerEvt.target.result
    setBase64(btoa(binaryString))
  }
  const handlePromptChange = async (e) => {
    setPrompt(e.target.value);
  };
  
  const handleColorChange = async (e) => {
    setColor(e.target.value);
  };
  
  const handlePunchlineText = async (e) => {
    setPunchlineText(e.target.value);
  };
  
  const handleButtonText = async (e) => {
    setButtonText(e.target.value);
  };
  

  const onFileSubmit = async (e: any) => {
    setIsLoading(true)
    e.preventDefault()
    console.log('bine', base64)
    let payload = { image: base64 }
    console.log('payload', typeof(payload))
    console.log('color', e.target.color.value)
    console.log('prompt', e.target.prompt.value)
    console.log('file', file)
    console.log('absolute', file.path)
    const formData = new FormData();
    formData.append('image', file);
    formData.append('prompt', e.target.prompt.value);
    formData.append('color',e.target.color.value);

    try {
      const response = await fetch('/generate', {
        method: 'POST',
        body: formData,
        mode: "no-cors",
        headers: {
          'Content-Type': 'image/png',
        }
      });
      //addToQueue(response)

      if (response.ok) {
        const result = await response.blob(); // Gelen görüntüyü al
        console.log(result)
        setResultImage(URL.createObjectURL(result));
      } else {
        console.error('Sunucu yanıt hatası:', response.statusText);
      }
    } catch (error) {
      console.error('Hata:', error);
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const photoUpload= async (e: any) => {
    e.preventDefault()
    const reader = new FileReader()
    const file = e.target.files[0]
    console.log('target',  e.target)
    console.log('reader', reader)
    console.log('file', file)
    if (reader !== undefined && file !== undefined) {
      reader.onloadend = () => {
        setFile(file)
        setSize(file.size)
        setName(file.name)
        setImagePreview(reader.result)
        setPrompt(prompt)
        setColor(color)
        setPunchlineText(punchlineText)
        setButtonText(buttonText)
        setLogoPreview(logoPreview)
      }
      reader.readAsDataURL(file)
    }
  
  };
  const logoUpload=async (e: any) => {
    e.preventDefault()
    const reader = new FileReader()
    const logo = e.target.files[0]
    console.log('target',  e.target)
    console.log('reader', reader)
    console.log('logo', logo)
    if (reader !== undefined && logo !== undefined) {
      reader.onloadend = () => {
        setSize(logo.size)
        setName(logo.name)
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(logo)
    }
  
  };

  const buttonStyle = {
    backgroundColor: color,
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: 10,
    display: "flex", 
    width: "fit-content"
  };
  

  const remove = async () => {
    setFile('')
    setImagePreview('')
    setBase64('')
    setName('')
    setSize('')
    setPrompt('')
    setColor('')
    setPunchlineText('')
    setButtonText('')
    setLogoPreview('')
    setResultImage('')
  }


  return (
    <S.Container>
      <form onSubmit={(e) => onFileSubmit(e)} onChange={(e) => onChange(e)}>
        <S.Card
          logo={Logo}
          width={imagePreview === '' ? 510 : 610}
          height={imagePreview === '' ? 800 : 780}
          style={{ marginRight: 200}}

        >
        
        
        <input
          type="text"
          id="prompt"
          value={prompt}
          onChange={handlePromptChange}
          placeholder='Type a prompt...'
          style={{marginTop:100,  width: 330, padding: "12px 20px", display: "inline-block", border: "1px solid #ccc", "borderRadius": "4px", "box-sizing": "border-box"}}
        />

        
        <input
          type="text"
          id="color"
          value={color}
          placeholder='Type your color...'
          onChange={handleColorChange}
          style={{  width: 330, padding: "12px 20px", margin: "8px 0", display: "inline-block", border: "1px solid #ccc", "border-radius": "4px", "box-sizing": "border-box"}}

        />

        <input
          type="text"
          maxLength={100}
          id="punchline"
          value={punchlineText}
          placeholder='Type your punchline text...'
          onChange={handlePunchlineText}
          style={{  width: 330, padding: "12px 20px", margin: "8px 0", display: "inline-block", border: "1px solid #ccc", "border-radius": "4px", "box-sizing": "border-box"}}

        />

        <input
          type="text"
          id="buttonText"
          maxLength={50}
          value={buttonText}
          placeholder='Type your button text...'
          onChange={handleButtonText}
          style={{  width: 330, padding: "12px 20px", margin: "8px 0", display: "inline-block", border: "1px solid #ccc", "border-radius": "4px", "box-sizing": "border-box"}}

        />
   
          <S.Perfil
            top={imagePreview === '' ? 0 : -10}
            width={imagePreview === '' ? 120 : 150}
            height={imagePreview === '' ? 120 : 150}
            style={{ margin: 20 }}

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
              
              <label>Upload an Image</label>
                <BsUpload />

            </>
            ) : (

              <img src={imagePreview} alt='Image' />

            )}

    </S.Perfil>
      <S.Perfil
            top={logoPreview === '' ? 0 : -10}
            width={logoPreview === '' ? 120 : 70}
            height={logoPreview === '' ? 120 : 70}
            style={{ marginBottom: 40 }}
    

          >
            {logoPreview === '' ? (
              <>
           
              
              <input
              type='file'
              name='avatar'
              id='logo'
              accept='.png'
              onChange={logoUpload}
              src={logoPreview}
              
                />
              
              <label>Upload an Logo</label>
                <BsUpload />

            </>
            ) : (

              <img src={logoPreview} alt='Logo' />

            )}


          </S.Perfil>


          {imagePreview && logoPreview !== '' && (
            <>



              <button style={{marginTop:50}} type='submit'>
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
      {resultImage && logoPreview !== '' && (
        <>
              <S.Card
              top={resultImage === '' ? 0 : -10}
              width={resultImage === '' ? 310 : 310}
              height={resultImage === '' ? 400 : 450}
    
    
            >
          
        
              <img style={{ display: "flex", "justify-content": "center", marginTop:-50}} width="70" height="70" src={logoPreview} alt='Logo' />
          
             

              <img style={{"border-radius": "14px 14px 14px 14px", marginTop:20}} width="250" height="250" src={resultImage} alt='Generated Image' />
              <label style={{margin:10, color:color, width: "fit-content","font-size": 20, display:"flex", "justify-content": "center", textAlign: 'center',}}>{punchlineText}</label>
              <button style={buttonStyle}>{buttonText}  </button>
        
              </S.Card>
              
              </>
            ) }
          
         
        

    </S.Container>
  );

}
class PromptColorForm extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {prompt: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({prompt: event.target.value});
  }

  handleSubmit(event) {
    alert('A prompt was submitted: ' + this.state.value);
    event.preventDefault();
  }




  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Prompt:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}