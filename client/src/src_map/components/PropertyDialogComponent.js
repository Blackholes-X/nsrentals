const PropertyDialogComponent = ({ activeProperty }) => {
    console.log("***************************^?????????????????????????????")
    console.log(JSON.stringify(activeProperty))
    console.log("***************************^?????????????????????????????")

    return (
        <div id="map-container">
            {/* Placeholder for the map */}
            <h3>Map Display Area</h3>
            {activeProperty && (
                <div className="popup">
                    <div className="sc-card sc-borderless">
                        <div className="sc-card-header">
                            <h5>{activeProperty.listing_name}-{activeProperty.building_name}</h5>
                        </div>
                        <div className="sc-card-body">
                            <table className="sc-table">
                                <tbody>
                                    <tr><td>Type</td><td>Appartment</td></tr>
                                    <tr><td>Rooms</td><td>{activeProperty.bedroom_count}</td></tr>
                                    <tr><td>Bed Rooms</td><td>{activeProperty.bedroom_count}</td></tr>
                                    <tr><td>Rent</td><td>${activeProperty.monthly_rent}</td></tr>
                                    <tr><td>description</td><td>${activeProperty.description}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="sc-card-footer">{activeProperty.excerpt}</div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default PropertyDialogComponent;
