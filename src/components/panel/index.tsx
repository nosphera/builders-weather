import React from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {IAddress} from '../../business/interfaces/iAddress';
import {IBaseProps} from '../../business/interfaces/iBaseProps';
import PanelHeader from './header';
import RenderDailyItem from './renderDailyItem';
import RenderHourlyItem from './renderHourlyItem';
import RenderWarnings from './addressDetails copy';
import {FullAddress, SectionLabel, Shimmer} from './styled';

interface IProps extends IBaseProps {
  address: IAddress;
  weatherData: any;
}

const Panel: React.FC<any> = ({weatherData, address, loading}: IProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  const currentData: any = weatherData?.current;
  const weatherPerDay = weatherData?.daily ?? [];
  const forecastPerHour = weatherData?.hourly ?? [];
  const alerts = weatherData?.alerts ?? [];
  const forecastDate: Date = new Date(currentData?.dt * 1000);

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainerStyle}>
      <PanelHeader
        weatherData={currentData}
        address={{...address, forecastDate}}
        loading={loading}
      />
      <Shimmer visible={!loading}>
        <FullAddress>{address?.formatted_address}</FullAddress>
      </Shimmer>
      <SectionLabel>Próximas Horas</SectionLabel>
      <Shimmer visible={!loading} height={96}>
        <FlatList
          data={forecastPerHour.slice(0, 24)}
          renderItem={({item}) => <RenderHourlyItem {...{item, loading}} />}
          keyExtractor={(item, index) => `h${index.toString()}`}
          horizontal={true}
        />
      </Shimmer>
      <SectionLabel>Para Semana</SectionLabel>
      <Shimmer visible={!loading} height={96}>
        <FlatList
          data={weatherPerDay}
          renderItem={RenderDailyItem}
          keyExtractor={(item, index) => `d${index.toString()}`}
          horizontal={true}
        />
      </Shimmer>
      <SectionLabel>Alertas</SectionLabel>
      <Shimmer visible={!loading} height={96}>
        {alerts && alerts.length ? (
          alerts.map(RenderWarnings)
        ) : (
          <Text>Sem alertas</Text>
        )}
      </Shimmer>
    </ScrollView>
  );
};
export default Panel;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 12,
  },
  contentContainerStyle: {
    paddingBottom: 64,
  },
});
