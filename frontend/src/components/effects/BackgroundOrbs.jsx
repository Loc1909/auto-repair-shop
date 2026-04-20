export default function BackgroundOrbs() {
  return (
    <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden" }}>
      <div style={{ position:"absolute",top:"5%",right:"5%",width:500,height:500,background:"radial-gradient(circle,rgba(255,107,43,.06) 0%,transparent 70%)",borderRadius:"50%" }} />
      <div style={{ position:"absolute",bottom:"0%",left:"-10%",width:400,height:400,background:"radial-gradient(circle,rgba(100,60,255,.04) 0%,transparent 70%)",borderRadius:"50%" }} />
    </div>
  );
}