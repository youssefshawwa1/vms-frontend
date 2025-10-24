import upleftImage from "../../assets/upleft.png";
import logoImage from "../../assets/logo.png";
import ibrahimSignature from "../../assets/ibrahim.png";
import alJalilahSignature from "../../assets/al-jalilah.png";
import youssefSignature from "../../assets/youssef.png";
import bottomrightImage from "../../assets/bottomright.png";
import "./Certificate.css";
const Certificate = ({ ref, data }) => {
  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date);
  }
  return (
    <div className="certificate-container">
      <div ref={ref} className="certificate">
        <img src={upleftImage} alt="upleft" className="upleft" />
        <div className="date">
          DATE: {formatDate(data.issueDate).toUpperCase() || "date here"}
        </div>

        <div className="header">
          <div className="logo">
            <img src={logoImage} alt="FEKRA Logo" />
          </div>
          <h1>CERTIFICATE</h1>
          <h2>
            OF <span className="type">{data?.certificateType || "type"}</span>
          </h2>
        </div>

        <div className="certify">this is to certify</div>
        <div className="name">{data?.fullName || "Name Here"}</div>

        <div className="under">
          <div className="circle"></div>
          <div className="under-name"></div>
          <div className="circle"></div>
        </div>

        <div className="description">{data?.customMessage}.</div>

        <div className="signatures">
          {/* Signature 1 */}
          <div className="signature-block">
            <div className="signature-name">
              <img className="signature" src={ibrahimSignature} alt="ibrahim" />
            </div>
            <div className="signature-line"></div>
            <div className="title">
              Ibrahim Mohammad <br />
              Founder
            </div>
          </div>
          {/* Signature 2 */}
          <div className="signature-block">
            <div className="signature-name">
              <img
                className="signature"
                src={alJalilahSignature}
                alt="al-jalilah"
              />
            </div>
            <div className="signature-line"></div>
            <div className="title">
              Al-Jalilah Shreih <br />
              Founder
            </div>
          </div>
          {/* Signature 3 */}
          <div className="signature-block">
            <div className="signature-name">
              <img className="signature" src={youssefSignature} alt="youssef" />
            </div>
            <div className="signature-line"></div>
            <div className="title">
              Youssef Shawwa <br />
              CEO
            </div>
          </div>
        </div>
        <div className="certificate-id">ID: {data?.certificateNumber}</div>
        <img
          className="bottomright"
          src={bottomrightImage}
          alt="bottom right decoration"
        />
      </div>
    </div>
  );
};

export default Certificate;
