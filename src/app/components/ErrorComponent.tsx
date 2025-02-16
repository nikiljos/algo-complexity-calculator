type ErrorComponentProps = {
  errorMsg: string | null;
};

export default function ErrorComponent({ errorMsg }: ErrorComponentProps) {
  if (errorMsg) {
    return (
      <div>
        <b>Error:</b> {errorMsg}
      </div>
    );
  } else {
    return <div>Sorry, Some error occured.</div>;
  }
}
