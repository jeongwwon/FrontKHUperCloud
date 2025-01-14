import * as React from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Checkbox,
  Drawer,
  Divider,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import Header from "./MainHeader";
import SideBar from "./SideBar";
import { useState, useEffect } from "react";
import ImageList from "../components/ImageList";
import Upload from "../components/Upload";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import DocumentList from "../components/DocumentList";
import DeleteList from "../components/DeleteList";
import { Link } from "react-router-dom";

function MainPage({ window }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerWidth = 200;
  const [imageUrls, setImageUrls] = useState([]);
  const [documentUrls, setDocumentUrls] = useState([]);
  const [childChecked, setChildChecked] = useState({});
  const [selfcheck, setselfcheck] = useState(false);
  const [parentChecked, setParentChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedOption, setSelectedOption] = useState("all");
  const [deleteList, setDeleteList] = useState([]);

  const handleAllFilesClick = () => {
    setSelectedOption("all");
  };

  const handlePhotoClick = () => {
    setSelectedOption("photo");
  };

  const handleDocumentsClick = () => {
    setSelectedOption("documents");
  };
  const handleDeleteFilesClick = () => {
    setSelectedOption("delete");
  };

  const handleChildCheckboxChange = (imgKey, newChecked) => {
    setChildChecked((prevChecked) => ({
      ...prevChecked,
      [imgKey.toString()]: { checked: newChecked, value: "some value" },
    }));
    const allChecked = Object.values(childChecked).every(
      (checked) => checked.checked
    );

    if (allChecked) {
      setParentChecked(true);
      setIndeterminate(false);
    } else {
      const someChecked = Object.values(childChecked).some(
        (checked) => checked.checked
      );
      setParentChecked(false);
      setIndeterminate(someChecked);
    }
  };

  const parentchange = (event) => {
    const newChecked = event.target.checked;
    //각각  imgkey,bool 값 할당
    const newChildChecked = Object.keys(childChecked).reduce(
      (result, imgKey) => {
        result[imgKey] = newChecked;
        return result;
      },
      {}
    );
    //console.log(newChildChecked);

    //변화된 child값 함수 호출 해서 변화
    Object.keys(newChildChecked).forEach((imgKey) => {
      handleChildCheckboxChange(imgKey, newChecked);
    });

    // Update state variables
    setIndeterminate(false);
    if (parentChecked) {
      setselfcheck(false);
    } else {
      setselfcheck(true);
    }
    setParentChecked(newChecked);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

                 {/* 삭제할 함수 */}
  const handleUpload = (file) => {
    if (file.type.includes("image")) {
      const imageData = {
        url: URL.createObjectURL(file),
        fileName: file.name,
        fileSize: file.size,
        imgKey: `img-${Date.now()}`,
      };
      setImageUrls((prevUrls) => [...prevUrls, imageData]);
    } else if (
      file.type.includes("application/pdf") ||
      file.type.includes(".doc") ||
      file.type.includes(".docx") ||
      file.type.includes("application/msword") ||
      file.type.includes("application/vnd.ms-excel") ||
      file.type.includes(".xls") ||
      file.type.includes(".xlsx") ||
      file.type.includes(".csv") ||
      file.type.includes(".ppt") ||
      file.type.includes(".pptx") ||
      file.type.includes("application/vnd.ms-powerpoint")
    ) {
      const documentData = {
        url: URL.createObjectURL(file),
        fileName: file.name,
        fileSize: file.size,
        docKey: `doc-${Date.now()}`,
      };
      setDocumentUrls((prevUrls) => [...prevUrls, documentData]);
    }
  };


  const handleDelete = () => {
    const selectedImages = Object.entries(childChecked)
      .filter(([_, checked]) => checked.checked)
      .map(([key]) => key);
    const selectedDocuments = Object.entries(childChecked)
      .filter(([_, checked]) => checked.checked)
      .map(([key]) => key);
    setImageUrls((prevImageUrls) =>
      prevImageUrls.filter(
        (imageUrl) => !selectedImages.includes(imageUrl.imgKey)
      )
    );
    setDocumentUrls((prevDocumentUrls) =>
      prevDocumentUrls.filter(
        (documentUrl) => !selectedDocuments.includes(documentUrl.docKey)
      )
    );

    const deletedItems = [
      ...imageUrls.filter((imageUrl) =>
        selectedImages.includes(imageUrl.imgKey)
      ),
      ...documentUrls.filter((documentUrl) =>
        selectedDocuments.includes(documentUrl.docKey)
      ),
    ];

    deletedItems.forEach((item) => {
      const uploadFilePath = encodeURIComponent(item.url); // 파일 경로 인코딩
      const deleteUrl = `http://52.200.100.241:8000/trash/delete/${uploadFilePath}`;
    
      fetch(deleteUrl, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    });

    setDeleteList((prevDeleteList) => [...prevDeleteList, ...deletedItems]);
    parentchange({ target: { checked: false } });
    setChildChecked({});
  };

  
  const handleRestore = () => {
    const selectedImages = Object.entries(childChecked)
      .filter(([_, checked]) => checked.checked)
      .map(([key]) => key);

    const selectedDocuments = Object.entries(childChecked)
      .filter(([_, checked]) => checked.checked)
      .map(([key]) => key);
    setImageUrls((prevImageUrls) => {
      const restoredImages = selectedImages.map((imageKey) => {
        const restoredImage = deleteList.find(
          (item) => item.imgKey === imageKey
        );
        if (restoredImage) {
          //console.log(restoredImage);
          return {
            fileName: restoredImage.fileName,
            fileSize: restoredImage.fileSize,
            imgKey: imageKey,
            url: restoredImage.url,
          };
        }
        return null;
      });
      const filteredRestoredImages = restoredImages.filter(Boolean);
      filteredRestoredImages.forEach((item) => {
        const uploadFilePath = encodeURIComponent(item.url); // 파일 경로 인코딩
        const deleteUrl = `http://52.200.100.241:8000/trash/restore/${uploadFilePath}`;
      
        fetch(deleteUrl, {
          method: 'DELETE',
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.log(error);
          });
      });
      return [...prevImageUrls, ...filteredRestoredImages];
    });
    setDocumentUrls((prevDocumentUrls) => {
      const restoredDocuments = selectedDocuments.map((documentKey) => {
        // Find the restored document details based on the documentKey
        const restoredDocument = deleteList.find(
          (item) => item.docKey === documentKey
        );

        if (restoredDocument) {
          // Return the restored document with correct details
          //console.log(restoredDocument);
          return {
            fileName: restoredDocument.fileName,
            fileSize: restoredDocument.fileSize,
            docKey: documentKey,
            url: restoredDocument.url, // Update with the correct URL for the document
            // Update with the correct filename for the document
          };
        }

        return null;
      });

      const filteredRestoredDocuments = restoredDocuments.filter(Boolean);
      filteredRestoredDocuments.forEach((item) => {
        const uploadFilePath = encodeURIComponent(item.url); // 파일 경로 인코딩
        const deleteUrl = `http://52.200.100.241:8000/trash/restore/${uploadFilePath}`;
      
        fetch(deleteUrl, {
          method: 'DELETE',
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.log(error);
          });
      });
      return [...prevDocumentUrls, ...filteredRestoredDocuments];
    });

    setDeleteList((prevDeleteList) =>
      prevDeleteList.filter(
        (item) =>
          !(
            selectedImages.includes(item.imgKey) ||
            selectedDocuments.includes(item.docKey)
          )
      )
    );
    parentchange({ target: { checked: false } });
    setChildChecked({});
  };

  
          
                              {/*삭제할 함수 */}
  const handleDownload = () => {
    const checkedKeys = Object.keys(childChecked).filter(
      (key) => childChecked[key].checked
    );
    checkedKeys.forEach((key) => {
      const imageData = imageUrls.find((image) => image.imgKey === key);
      if (imageData) {
        const fileName = imageData.fileName; // Set the file name based on the imageData
        const downloadUrl = `http://43.207.224.148:8000/download/file?file_name=${encodeURIComponent(
          fileName
        )}`; // Construct the download URL
        window.open(downloadUrl); // Open the download URL in a new window/tab
      }
    });
  };

  //childcheck 상태 기반 부수효과
  useEffect(
    () => {
      const allChecked =
        Object.keys(childChecked).length > 0 &&
        Object.values(childChecked).every((checked) => checked.checked);
      const someChecked = Object.values(childChecked).some(
        (checked) => checked.checked
      );
      setParentChecked(allChecked);
      if (someChecked && !allChecked) {
        setIndeterminate(true);
      } else {
        setIndeterminate(false);
      }
    },
    [childChecked],
    handleAllFilesClick,
    handleDeleteFilesClick
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  //새폴더생성
  const [showModal, setShowModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folders, setFolders] = useState([]);
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const createFolder = () => {
    if (newFolderName.trim() === "") {
      alert("폴더 이름을 입력해주세요.");
      return;
    }

    // 기존 폴더 목록에 새 폴더 추가
    const newFolder = {
      id: Math.random().toString(36).substring(7), // 무작위 ID 생성
      name: newFolderName,
    };

    // 기존 폴더 목록에 새 폴더를 추가한 후, 업데이트된 폴더 목록으로 상태를 업데이트합니다.
    setFolders((prevFolders) => [...prevFolders, newFolder]);

    // 폴더 생성 후 입력 필드 초기화
    setNewFolderName("");
    closeModal();
    // 모달 닫기
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Header setMobileOpen={handleDrawerToggle} />
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        ></Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          <SideBar
            onAllFilesClick={handleAllFilesClick}
            onPhotoClick={handlePhotoClick}
            onDocumentsClick={handleDocumentsClick}
            onDeleteClick={handleDeleteFilesClick}
          />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          p: 3,
          display: "flex",
          maxWidth: "100%",
        }}
      >
        <Box sx={{ position: "absolute", top: 82, left: 200, width: "85%" }}>
          <Box
            sx={{ display: "flex", alignItems: "center", marginLeft: "14px" }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={parentChecked}
                  indeterminate={indeterminate}
                  onChange={parentchange}
                />
              }
              sx={{ marginRight: 1 }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Divider orientation="vertical" sx={{ height: "100%" }} />
              {/*서버에 삭제 요청 handleEmptyTrash 정의 필요*/}
              {selectedOption === "delete" ? (
                <>
                  <Button
                    sx={{ marginTop: 0.3, marginLeft: 1 }}
                    variant="contained"
                    /*onClick={handleEmptyTrash}*/
                  >
                    휴지통 비우기
                  </Button>
                  <Button
                    sx={{ marginTop: 0.3, marginLeft: 1 }}
                    variant="outlined"
                    onClick={handleRestore}
                  >
                    복원
                  </Button>
                </>
              ) : (
                <>
                  <Upload
                    onCreateImage={handleUpload}
                    onCreateDocument={handleUpload}
                  />

                  <Button
                    sx={{ marginTop: 0.3, marginLeft: 1 }}
                    variant="outlined"
                    onClick={openModal}
                  >
                    새폴더
                  </Button>

                  {/* 모달 */}
                  {showModal && (
                    <div className="modal-overlay2">
                      <div className="modal2">
                        <div className="modal-content2">
                          <h3>새 폴더 생성</h3>
                          <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="폴더 이름"
                          />
                          <button onClick={createFolder}>생성</button>
                          <button onClick={closeModal}>취소</button>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    sx={{ marginTop: 0.3, marginLeft: 1 }}
                    onClick={handleDownload}
                    variant="outlined"
                  >
                    내려받기
                  </Button>
                  <Button
                    sx={{ marginTop: 0.3, marginLeft: 1 }}
                    variant="outlined"
                    onClick={handleDelete}
                  >
                    삭제
                  </Button>
                </>
              )}
            </Box>
          </Box>
          <Divider sx={{ my: 2.3 }} />
        </Box>

        <Box>
          {selectedOption === "all" ? (
            <>
              <Box sx={{ mt: 16 }}>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {folders.map(
                    (
                      folder //이때 이 folders 는 백에서 가지고 와서 mappping ?
                    ) => (
                      <div style={{display: "flex", flexDirection: "column", alignItems: "center",margin:20}}>
                        <div
                          key={folder.name}
                          style={{ border: "1px solid silver"  }}
                        >
                          <Link to={`/folder/${folder.name}`}>
                            <img
                              key={folder.name}
                              src="/images/Folder.png"
                              alt={folder.name}
                              style={{
                                width: "100px",
                                height: "100px",
                                margin: "20px",
                              }}
                            />
                          </Link>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <p style={{ marginTop: 5,fontSize:13 }}>{folder.name}</p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </Box>
              <div style={{ margin: "5px", flexBasis: "100%" }}>
                <ImageList
                  imageUrls={imageUrls}
                  parentcheck={selfcheck}
                  childChecked={childChecked}
                  onChildCheckboxChange={handleChildCheckboxChange}
                />
              </div>
              <div
                style={{
                  margin: "0px",
                  flexBasis: "100%",
                  paddingTop: "0",
                  marginTop: -130,
                }}
              >
                <DocumentList
                  documentUrls={documentUrls}
                  parentcheck={selfcheck}
                  childChecked={childChecked}
                  onChildCheckboxChange={handleChildCheckboxChange}
                />
              </div>
            </>
          ) : selectedOption === "photo" ? (
            <Box sx={{ mt: 20 }}>
              <ImageList
                imageUrls={imageUrls}
                parentcheck={selfcheck}
                childChecked={childChecked}
                onChildCheckboxChange={handleChildCheckboxChange}
              />
            </Box>
          ) : selectedOption === "documents" ? (
            <DocumentList
              documentUrls={documentUrls}
              parentcheck={selfcheck}
              childChecked={childChecked}
              onChildCheckboxChange={handleChildCheckboxChange}
            />
          ) : selectedOption === "delete" ? (
            <DeleteList
              deleteList={deleteList}
              parentcheck={selfcheck}
              childChecked={childChecked}
              onChildCheckboxChange={handleChildCheckboxChange}
            />
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}

MainPage.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default MainPage;
