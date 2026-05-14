import { useState,useEffect} from "react";
import { useAuth } from "@clerk/clerk-react";
import QuestionViewer from "@/components/QuestionViewer";
import ReportPage from "@/components/ReportPage";

const Interview = ({ result, job , onRevert }) => {
  const { getToken } = useAuth();
  const [phase, setPhase] = useState("interview"); 
  const [report, setReport] = useState(null);

  const handleFinish = (reportData) => {
    setReport(reportData);
    setPhase("report");
  };

  const handleRestart = () => {
    setReport(null);
    setPhase("interview");
    onRevert();
  };
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      setToken(token);
    };
    fetchToken();
  }, [getToken]);

  if (phase === "report") {
    return <ReportPage report={report} onRestart={handleRestart} />;
  }

  return (
    <QuestionViewer
      sessionId={result.sessionId}
      questions={result.questions}
      onFinish={handleFinish}
      token={token}
    />
  );
};

export default Interview;