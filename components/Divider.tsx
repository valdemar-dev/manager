interface Props {
  height: string,
}

export default function Divider(props: Props) {
  return (
    <div className={`${props.height}`}></div>
  )
}