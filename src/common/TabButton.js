export const TabButton = (params) => {
    const {props} = params;
    return (
    <button
      type='button'
      onClick={() => {
        props.goToStep(params.step);
        props.setProgress(params.progress);
      }}
      className={`btn ${params.active}`}
    >
      <p>{params.title}</p>
    </button>
    )
  }