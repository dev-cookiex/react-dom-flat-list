import forwardComponent from '@cookiex-react/forward-component'
import useRefs from '@cookiex-react/use-refs'

import React, { ReactElement, useEffect, CSSProperties, useMemo, useCallback, useRef } from 'react'

const isReached = ( current: number, total: number, threshold: number ): boolean => current / total >= 1 - threshold

const FlatList: FlatList = forwardComponent<FlatList.Props<any>, FlatList.Reference>( ( Component, {
  data,
  renderItem,
  keyExtractor,
  disableDefaultStyleInject,
  onEndReached,
  onEndReachedThreshold = 0.5,
  ListEmptyComponent,
  ListFooterComponent,
  ListHeaderComponent,
  horizontal,
  style = {},
  ...props
}, ref ) => {
  const alreadyReachedEnd = useRef( false )
  const scrollPosition = useRef( 0 )
  const element = useRef<HTMLElement>( null )

  const onScroll = useCallback( ( event: HTMLElementEventMap['scroll'] ) => {
    const target = event.target ?? event.currentTarget
    if ( !target || !( target instanceof HTMLElement ) ) return void 0
    if ( isReached( scrollPosition.current = target.scrollTop, target.scrollHeight, onEndReachedThreshold ) ) {
      if ( !alreadyReachedEnd.current ) {
        onEndReached?.()
        alreadyReachedEnd.current = true
      }
    } else { alreadyReachedEnd.current = false }
  }, [ onEndReachedThreshold, onEndReached ] )

  useEffect( () => { alreadyReachedEnd.current = false }, [ data ] )

  useEffect( () => {
    if ( element.current )
      if ( !( element.current instanceof HTMLElement ) ) {
        console.error( new Error( 'FlatList only accept HTMLElement in as property, please change for all functionallity' ) )
      } else {
        element.current.addEventListener( 'scroll', onScroll )
        const close = () => element.current?.removeEventListener( 'scroll', onScroll )
        return close
      }
  }, [ onScroll ] )

  const dstyle = useMemo( () =>
    !disableDefaultStyleInject
      ? horizontal
        ? defaultHorizontalStyle
        : defaultStyle
      : {}, [ disableDefaultStyleInject, horizontal ] )

  const rstyle = useMemo( () => ( { ...dstyle, ...style } ), [ style, dstyle ] )

  return (
    <Component {...props} style={rstyle} ref={useRefs( ref, element )}>
      { ListHeaderComponent && <ListHeaderComponent /> }
      { !data.length && ListEmptyComponent && <ListEmptyComponent /> }
      { data.map( ( item, index ) =>
        <FlatListItem
          item={item}
          index={index}
          key={keyExtractor( item, index )}
          separators={ {} }
          renderItem={renderItem}
          keyExtractor={keyExtractor} />
      ) }
      { ListFooterComponent && <ListFooterComponent /> }
    </Component>
  )
}, 'div' )


type ItemProps = FlatList.ItemInfo<any> & {
  renderItem: FlatList.RenderItem<any>,
  keyExtractor: FlatList.KeyExtractor<any>
}

const FlatListItem = ( { item, index, separators, renderItem }: ItemProps ) =>
  useMemo( () => renderItem( { item, index, separators } ), [ item, index, separators, renderItem ] )

const defaultStyle = {
  height: '100%',
  maxHeight: '100vh',
  overflowY: 'scroll'
} as CSSProperties

const defaultHorizontalStyle = {
  width: '100%',
  maxWidth: '100vw',
  overflowX: 'scroll',
  display: 'flex'
} as CSSProperties

FlatList.displayName = 'FlatList'

interface FlatList {
  <T extends any, E extends forwardComponent.AnyElement>(
    props: forwardComponent.Props<FlatList.Props<T>, E, FlatList.Reference>
  ): JSX.Element
  displayName?: string
}
namespace FlatList {
  export interface Reference {}

  export interface ItemInfo<T> {
    item: T
    index: number
    separators: any
  }

  export type RenderItem<T> = ( info: ItemInfo<T> ) => ReactElement
  export type KeyExtractor<T> = ( item: T, index: number ) => string
  export interface Props<T> {
    data: T[]

    renderItem: RenderItem<T>
    keyExtractor: KeyExtractor<T>

    onEndReached?(): void
    onEndReachedThreshold?: number

    horizontal?: boolean

    ListEmptyComponent?: React.ComponentType<any>
    ListHeaderComponent?: React.ComponentType<any>
    ListFooterComponent?: React.ComponentType<any>

    style?: CSSProperties

    disableDefaultStyleInject?: boolean
    children?: undefined
  }
  export type Elements = keyof JSX.IntrinsicElements
}

export default FlatList
