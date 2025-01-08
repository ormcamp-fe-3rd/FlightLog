// const footerImg =  "./public/images/common/footer.png";
const footerClass =
  "w-full h-[210px] bg-black pt-10 flex flex-col items-center";

export default function Footer() {
  return (
    <footer>
      <div className="w-full text-white">
        <div className={footerClass}>
          <ul className="flex w-full max-w-[565px] justify-between px-10">
            <li className="font-semibold">회사소개</li>
            <li className="font-semibold">이용약관</li>
            <li className="font-semibold">개인정보처리방침</li>
            <li className="font-semibold">커뮤니티</li>
          </ul>
          <div className="tablet:w-[565px] mt-4 w-full px-10">
            <div>
              <p className="text-lg font-semibold">DRONVISION_</p>
              <p className="tablet:text-base text-xs">
                <br />
                상호: Dronvision | 전화: 02-0000-0000 | 이메일:
                Dronvision@Wkd.co.kr <br />
                주소: 서울시 강남구 000로 00타워 1001호
                <br />
                사업자등록번호: 000-00-00000 <br />
                Copyright © 2025 Dronvision
                <br />
              </p>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
