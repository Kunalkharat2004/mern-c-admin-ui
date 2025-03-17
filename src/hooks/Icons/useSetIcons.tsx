import Icon from "@ant-design/icons";

// This hook returns a render function that creates an overlay of two icons.
const useOverlayIcons = () => {
  /**
   * Renders an icon overlay.
   *
   * @param {React.ComponentType} BackgroundIcon - The background icon component.
   * @param {React.ComponentType} OverlayIcon - The icon to overlay on top.
   * @param {object} [options] - Optional customizations.
   * @param {object} [options.backgroundProps] - Props for the background icon.
   * @param {object} [options.overlayProps] - Props for the overlay icon.
   * @param {object} [options.overlayStyle] - Additional style overrides for the overlay icon.
   * @returns {JSX.Element}
   */
  const renderOverlayIcons = (
    BackgroundIcon,
    OverlayIcon,
    options = {}
  ) => {
    const { backgroundProps = {}, overlayProps = {}, overlayStyle = {} } = options;

    return (
      <div style={{ position: "relative", display: "inline-block" }}>
        <Icon component={BackgroundIcon} {...backgroundProps} />
        <Icon
          component={OverlayIcon}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            ...overlayStyle,
          }}
          {...overlayProps}
        />
      </div>
    );
  };

  return renderOverlayIcons;
};

export default useOverlayIcons;
