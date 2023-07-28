"use client";

interface Props {
  animationDelay: string,
  title: string,
  children: React.ReactNode,
  type: string,
}


export default function Card(props: Props) {
  if (props.type === "primary") {
    return (
      <div className={`bg-primary-100 text-primary-text shadow-md p-4 rounded-xl flex flex-col gap-2 fadeIn ${props.animationDelay} h-max`}>
        <h3 className="text-xl font-semibold border-primary-600 border-b-2 w-fit">{ props.title }</h3>
        { props.children }
      </div>
    )
  } else if (props.type === "secondary") {
    return (
      <div className={`bg-secondary-100 shadow-md p-4 rounded-xl flex flex-col gap-2 fadeIn ${props.animationDelay} h-max`}>
        <h3 className="text-xl font-semibold border-accent-100 border-b-2 w-fit">{ props.title }</h3>
        { props.children }
      </div>
    )
  }

}