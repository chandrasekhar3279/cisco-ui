const NavIcon = (props: any) => {
  return props.items.icon ? (
    <span className="pcoded-micon">
      <i className={props.items.icon} />
    </span>
  ) : null;
};

export default NavIcon;
