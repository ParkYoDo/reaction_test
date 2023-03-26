import React, { useRef, useState } from 'react';
import * as S from './HomeStyle';
import {
  Button,
  Container,
  Navbar,
  Table,
  InputGroup,
  Form,
} from 'react-bootstrap';

function App() {
  const [user, setUser] = useState(['박요도']);
  const [name, setName] = useState(['']);
  const [modal, setModal] = useState(true);
  const [message, setMessage] = useState('화면을 클릭하여 시작');
  const [screenState, setScreenState] = useState('waiting');
  const [count, setCount] = useState(0);
  const [resultTime, setResultTime] = useState([]);
  const [resultAvg, setResultAvg] = useState([]);

  const timeOut = useRef();
  const startTime = useRef();
  const endTime = useRef();
  const AscendingArr = [...resultAvg].sort((a, b) => a[1] - b[1]);

  const closeModal = () => {
    setModal(false);
  };

  const screenClick = () => {
    if (count < 3) {
      if (screenState === 'waiting') {
        setScreenState('ready');
        setMessage('초록색 화면으로 변하면 클릭!');

        timeOut.current = setTimeout(() => {
          setScreenState('go');
          setMessage('클릭!');
          startTime.current = new Date();
        }, Math.random() * 1 + 3000);
      } else if (screenState === 'ready') {
        clearTimeout(timeOut.current);
        setScreenState('waiting');
        setMessage('클릭을 너무 일찍했음');
      } else if (screenState === 'go') {
        endTime.current = new Date();
        clearTimeout(timeOut.current);
        setScreenState('waiting');
        setMessage('다시 시작하려면 화면 클릭');
        setResultTime((prev) => {
          return [...prev, endTime.current - startTime.current];
        });
        setCount(count + 1);
      }
    }
  };

  const Retry = () => {
    let avg = Math.floor((resultTime[0] + resultTime[1] + resultTime[2]) / 3);
    setResultAvg((prev) => {
      return [...prev, [user, avg]];
    });
    setResultTime([]);
    setCount(0);
  };

  const onChange = (e) => {
    setName(e.target.value);
  };

  const changeName = () => {
    setUser(name);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="./">
            <S.NavLogo
              src="/logo.svg"
              alt="Logo_Image"
              className="d-inline-block align-top"
            />
            반응속도 테스트
          </Navbar.Brand>
          <Navbar.Text>
            <S.NavContent>{user}</S.NavContent>
          </Navbar.Text>
        </Container>
      </Navbar>

      {modal && (
        <S.ModalDiv>
          <S.ModalTitle>게임설명</S.ModalTitle>
          <S.ModalContent>
            3번의 반응속도를 측정 후 평균값을 보여줍니다
          </S.ModalContent>
          <S.ModalContent>
            시작하려면 게임설명을 닫고 화면을 클릭하세요
          </S.ModalContent>
          <Button variant="info" className="mt-2" onClick={closeModal}>
            닫기
          </Button>
        </S.ModalDiv>
      )}

      {/* Main Screen */}
      <S.ScreenDiv screenState={screenState} onClick={screenClick}>
        <S.ScreenTitle>{message}</S.ScreenTitle>
        {message === '다시 시작하려면 화면 클릭' && count !== 0 && (
          <S.ScreenContent>
            {count}번째 시도는 {resultTime[count - 1]}ms입니다.
          </S.ScreenContent>
        )}
        {count === 3 && (
          <>
            <S.ScreenContent>
              평균값은
              {Math.floor((resultTime[0] + resultTime[1] + resultTime[2]) / 3)}
              ms입니다.
            </S.ScreenContent>
            <Button variant="warning" className="mt-2" onClick={Retry}>
              다시 시도
            </Button>
          </>
        )}
      </S.ScreenDiv>

      <S.InputDiv>
        <InputGroup className="mt-5" onChange={onChange}>
          <Form.Control placeholder="변경할 이름을 입력하세요" />
          <Button variant="outline-secondary" onClick={changeName}>
            변경
          </Button>
        </InputGroup>

        {/* Score */}
        <Table
          className="mt-5"
          striped
          bordered
          hover
          style={{ borderRadius: '12px' }}
        >
          <S.TableHead>
            <S.TableTr>
              <S.TableTd>순 위</S.TableTd>
              <S.TableTd>이 름</S.TableTd>
              <S.TableTd>시 간</S.TableTd>
            </S.TableTr>
          </S.TableHead>
          <S.TableBody>
            {AscendingArr.map((array, i) => {
              return (
                <S.TableTr>
                  <S.TableTd>{i + 1}</S.TableTd>
                  <S.TableTd>{array[0]}</S.TableTd>
                  <S.TableTd>{array[1]}ms</S.TableTd>
                </S.TableTr>
              );
            })}
          </S.TableBody>
        </Table>
      </S.InputDiv>
    </>
  );
}

export default App;
