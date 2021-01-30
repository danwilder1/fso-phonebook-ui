const Notification = ({ message, type }) => {
  const common = {
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  const success = { ...common, color: "green" };
  const error = { ...common, color: "red" };

  const style = type === "success" ? success : error;

  return <div style={style}>{message}</div>;
};

export default Notification;
