import { LayerGroup } from 'react-leaflet';

import CustomMarker from './CustomMarker';

const CustomLayer = ({ group }) => {

  return (
    <LayerGroup key={group[0]}>
      
      {/* {group[1].map((marker) => (
        <CustomMarker type={group[0]} key={marker.id} marker={marker} />
      ))} */}
    </LayerGroup>
  );
};
export default CustomLayer;
