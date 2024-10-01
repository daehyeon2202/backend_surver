const express = require('express');
const cors = require('cors');
const fs = require('fs'); // 파일 시스템 모듈을 사용해 데이터를 저장
const app = express();
const port = process.env.PORT || 3002;

// CORS 설정 - 특정 도메인만 허용하도록 설정
app.use(cors({
    origin: ['https://2basekit.com', 'https://2base7950977.imweb.me'], // 허용할 도메인 리스트
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// JSON 데이터 파싱을 위한 미들웨어 설정
app.use(express.json());

// 기본 라우트 - 서버 실행 확인용
app.get('/', (req, res) => {
    res.send('서버가 성공적으로 실행되었습니다!');
});

// JotForm Webhook 데이터를 수신하는 라우트
app.post('/webhook', (req, res) => {
    const formData = req.body; // JotForm에서 받은 데이터를 수신

    // 데이터를 JSON 파일로 저장
    fs.writeFile('form_data.json', JSON.stringify(formData, null, 2), (err) => {
        if (err) {
            console.error('데이터 저장 오류:', err);
            return res.status(500).send('데이터 저장에 실패했습니다.');
        }
        console.log('데이터가 성공적으로 저장되었습니다.');
        res.send('JotForm에서 데이터를 성공적으로 수신 및 저장했습니다!');
    });
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
