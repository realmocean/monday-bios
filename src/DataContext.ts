import { DataContext, UIRecordContext, jsonServerProvider, UIView } from '@tuval/forms';


export const RealmOceanDataContext = (content:  UIView) => (
    DataContext(content).dataProvider(jsonServerProvider('/realmocean'))
)

export const RealmDataContext = (content:  UIView) => (
    DataContext(content).dataProvider(jsonServerProvider('/api'))
)