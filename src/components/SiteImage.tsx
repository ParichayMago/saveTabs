interface Iimage {
  img: any
}

const SiteImage = ({img}:Iimage )=> {
  return (
    <div className="w-12 h-12 rounded-md">
      <img src={img}
      alt="site image"
      draggable="false"
      >
      </img>
    </div>
  )
}

export default SiteImage