import { useContext, useRef, useState } from "react";
import Icon from "common/components/icons";
import {
  AttachButton,
  Button,
  ButtonsContainer,
  IconsWrapper,
  Input,
  SendMessageButton,
  Wrapper,
} from "./styles";
import { Message, getMessages } from "../messages-list/data/get-messages";
import { useParams } from "react-router-dom";
import { MyContext } from "../my-context/MyContext";

const attachButtons = [
  { icon: "attachRooms", label: "Choose room" },
  { icon: "attachContacts", label: "Choose contact" },
  { icon: "attachDocument", label: "Choose document" },
  { icon: "attachCamera", label: "Use camera" },
  { icon: "attachImage", label: "Choose image" },
];

export default function Footer() {
  const [showIcons, setShowIcons] = useState(false);
  const [message, setMessage] = useState("");
  const messages = getMessages();
  const lastMessage = messages[messages.length - 1];
  const isOpponent = lastMessage ? lastMessage.isOpponent : false;
  const [file, setFile] = useState<File>();
  const [imageSrc, setImageSrc] = useState<string>();
  const [pdfSrc, setPdfSrc] = useState<string>();
  const [thumbnail, setThumbnail] = useState<string>();


  const { items, setItems } = useContext(MyContext);

  const fileInputRef = useRef(null);
  const cameraRef = useRef(null);
  const imageRef = useRef(null);
  const contactRef = useRef(null);


  interface CustomMessage extends Message {
    isOpponent: boolean;
    file?: File;
    imageurl?: string;
    pdfurl?: string;
  }

  const sendMessage = (username) => {
    const newMessage: CustomMessage = {
      id: (items.length + 1).toString(),
      body: message,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().getHours() + ":" + new Date().getMinutes(),
      messageStatus: "SENT", // Provide a default value
      isOpponent: isOpponent,
      username: username,
      file: file,
      imageurl: imageSrc,
      pdfurl: pdfSrc,
    };
    // messages.push(newMessage);
    setItems([...items, newMessage]);
    setMessage("");
    setFile(undefined);
    setImageSrc(undefined);
    console.log(messages[messages.length - 1].file?.name)
    console.log(newMessage)
  };

  const handleButtonClick = (label) => {
    if (label === "Choose document") {
      if (fileInputRef.current) {
        (fileInputRef.current as HTMLInputElement).click();
      }
    } else if (label === "Choose image") {
      if (imageRef.current) {
        (imageRef.current as HTMLInputElement).click();
      }
    } else if (label === "Use camera") {
      if (cameraRef.current) {
        (cameraRef.current as HTMLInputElement).click();
      }
    } else if (label === "Choose room") {
      alert("Choose room");
    } else if (label === "Choose contact") {
      // if (contactRef.current) {
      //   (contactRef.current as HTMLInputElement).click();
      // }
      alert("Choose contact");
    } else {
      alert("Unknown button");
    }
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      setImageSrc(URL.createObjectURL(file));
      setShowIcons(!showIcons)
      // console.log(file.name);
    }
  };

  const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      setPdfSrc(URL.createObjectURL(file));
      // console.log(file.name);
    }
  };




  const params = useParams();
  const username = params.id;

  return (
    <Wrapper>
      <IconsWrapper>
        <AttachButton onClick={() => setShowIcons(!showIcons)}>
          <Icon id="attach" className="icon" />
        </AttachButton>
        <ButtonsContainer>
          {attachButtons.map((btn) => (
            <>
              <Button showIcon={showIcons} key={btn.label} onClick={() => handleButtonClick(btn.label)} >
                <Icon id={btn.icon} />
              </Button>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={cameraRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              // value={''}
              />
              <input
                type="file"
                ref={imageRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                value={''} />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange2}
                value={''} />
              <input
                type="file"
                ref={contactRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                value={''} />
            </>

          ))}
          {imageSrc && (
            <>
              <img src={imageSrc} alt="preview" style={{ width: '100px', height: '100px' }} />
              <button style={{position:"relative", left:"60px", background:"red", width:"25px", height:"25px", borderRadius:"50%"}} onClick={() => setImageSrc(undefined)}>X</button>
            </>
          )}
        </ButtonsContainer>
      </IconsWrapper>
      <Input placeholder="Type a message here .." value={message} onChange={
        (e) => setMessage(e.target.value)
      } />
      <SendMessageButton onClick={() => sendMessage(username)}>
        <Icon id="send" className="icon" />
      </SendMessageButton>
    </Wrapper>
  );
}
