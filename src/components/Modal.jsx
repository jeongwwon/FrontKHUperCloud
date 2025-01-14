import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  TextField,
  Box,
} from "@mui/material";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import TranslateIcon from "@mui/icons-material/Translate";
import React, { useState, useEffect } from "react";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import Share from "./Share";
import ShareIcon from '@mui/icons-material/Share';

const Modal = ({ open, onClose, filename, url }) => {
  const [isImage, setIsImage] = useState(false);
  const [isEncrypt, setEncrypt] = useState(false);
  const [password, setPassword] = useState("");
  const [isShareOpen, setShareOpen] = useState(false);
  const [isUnlockModalOpen, setUnlockModalOpen] = useState(false);
const [unlockPassword, setUnlockPassword] = useState("");
const handlesubmit = (unlockPassword) => {
  if(unlockPassword==password){
    setUnlockModalOpen(false);
    setEncrypt(false);
  }
}
const handleUnlock = () => {
  setUnlockModalOpen(true);
};

  const openShare = () => {
    if (isEncrypt) {
      setUnlockModalOpen(true);
    } else {
      setShareOpen(true);
    }
  };

  const handlePasswordSubmit = (submittedPassword) => {
    setPassword(submittedPassword);
    
    setEncrypt(true);
  };
  useEffect(() => {
    if (filename) {
      const fileExtension = filename.split(".").pop().toLowerCase();
      const imageExtensions = ["png", "jpg", "jpeg", "gif"];
      setIsImage(imageExtensions.includes(fileExtension));
    }
  }, [filename]);
  

  let wordImage = "/images/DOCX.png";
  let content;
  
  if (isImage && !isEncrypt) {
    content = (
      <img src={url} alt={filename} style={{ width: "100%", height: "100%" }} />
    );
  } else if (isEncrypt) {
    content = (
      <img
        src="/images/Lock.png"
        alt="Lock"
        style={{ width: "100%", height: "100%" }}
      />
    );
  } else if (filename && filename.endsWith(".pdf")) {
    content = (
      <iframe
        src={url}
        title={filename}
        style={{ width: "100%", height: "100%" }}
      />
    );
  } else if (
    filename &&
    (filename.endsWith(".doc") ||
      filename.endsWith(".docx") ||
      filename.startsWith("application/msword"))
  ) {
    content = (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <img
          src={wordImage}
          alt="Word Icon"
          style={{ marginTop: 150, maxWidth: "150%", maxHeight: "150%" }}
        />
      </div>
    );
  }
  

  const handleTranslate = () => {
    const filePath = encodeURIComponent(url); // 파일 경로를 인코딩
  
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filePath })
    };
  
    fetch(`http://52.200.100.241:8000/translate/${filePath}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        const downloadUrl = response.downloadUrl;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = '${filename}_translated_file.txt'
        link.click();
      })
      .catch(error => {
        console.log("error!");
      });
  };
  
  

  return (
    <Dialog open={open} onClose={onClose}>
      {!isEncrypt ? (
        <>
          <DialogTitle>
            {filename}
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ height: "600px", width: "600px" }}>
            <Box display="flex" justifyContent="flex-end" marginBottom={1}>
              {!isImage ? (
                <IconButton aria-label="translate" onClick={handleTranslate}>
                  <TranslateIcon sx={{ fontSize: 50 }} />
                </IconButton>
              ) : (
                <IconButton aria-label="delete" /*onClick={handleDelete}*/>
                  <DeleteIcon sx={{ fontSize: 50 }} />
                </IconButton>
              )}
              <IconButton aria-label="translate">
                <ShareIcon
                  sx={{ fontSize: 50 }}
                  onClick={openShare}
                />
                {isShareOpen && (
                  <Share
                    open={isShareOpen}
                    onClose={() => setShareOpen(false)}
                    handlePasswordSubmit={handlePasswordSubmit}
                    url={url}
                    filename={filename}
                  />
                )}
              </IconButton>
              <IconButton aria-label="download" /*onClick={handleDownload}*/>
                <DownloadIcon sx={{ fontSize: 50 }} />
              </IconButton>
            </Box>

            {content}
          </DialogContent>
        </>
      ) : (
        <DialogContent sx={{ height: "600px", width: "600px" }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
            <Box
      position="absolute"
      bottom={20}
      display="flex"
      justifyContent="center"
      width="100%"
    >
            <Button variant="contained" onClick={handleUnlock}>
              잠금 해제
            </Button>
            <Dialog open={isUnlockModalOpen} onClose={() => setUnlockModalOpen(false)}>
  <DialogTitle>잠금 해제</DialogTitle>
  <DialogContent>
    <TextField
      label="비밀번호"
      type="password"
      value={unlockPassword}
      onChange={(e) => setUnlockPassword(e.target.value)}
      fullWidth
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setUnlockModalOpen(false)}>취소</Button>
    <Button onClick={() => handlesubmit(unlockPassword)}>
      확인
    </Button>
  </DialogActions>
</Dialog>
            </Box>
            <img
              src="/images/Lock.png"
              alt="Lock"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default Modal;
